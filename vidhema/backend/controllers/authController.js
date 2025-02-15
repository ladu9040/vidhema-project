const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { auth_db } = require('../config/database'); 
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: `${process.env.SMTP_HOST}`,  
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS  
    },
    debug: true  
});


const sendVerificationEmail = async (email, verificationToken) => {
    const verificationLink = `http://localhost:5173/verify/${verificationToken}`;    
    try {
        // Verify transporter configuration
        await transporter.verify();
        
        // Send email with detailed error handling
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verify your email address',
            html: `
                <h1>Verify your email address</h1>
                <p>Click the following link to verify your email:</p>
                <a href="${verificationLink}">${verificationLink}</a>
            `
        });
        
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
};


const  authController = {

    // -------------------- VERIFY EMAIL  -----------------------

    verifyEmail: async (req, res) => {
        try {
            const { token } = req.params;
            console.log("Verification attempt for token:", token);
            
            // Check if user exists with this token
            const [users] = await auth_db.execute(
                'SELECT * FROM users WHERE verification_token = ?',
                [token]
            );
            console.log("Found users:", users.length);
            
            if (users.length === 0) {
                console.log("No user found with token");
                return res.status(400).json({ message: 'Invalid verification token' });
            }
    
            // Update user verification status
            await auth_db.execute(
                'UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = ?',
                [token]
            );
            console.log("User verified successfully");
    
            res.json({ success: true, message: "Email verified successfully" });
        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // -------------------- SIGNUP  -----------------------
    signup: async(req, res)=>{
        try {
            const { name, email, password, confirmPassword, dob, profile_image } = req.body;
            console.log("user data in controller", req.body); //for testing whether the userData is coming or not
            if (!name || !email || !password || !confirmPassword || !profile_image || !dob) {
                return res.status(400).json({message: 'All fields must be provided'});
            }
            if (password !== confirmPassword) {
                return res.status(400).json({message: 'Passwords do not match'});
                
            }

            const [existingUser] = await auth_db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUser.length > 0) {
                return res.status(400).json({message: 'User already exists'});
            }


            const hashPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');
            
            // Insert user into database
            await auth_db.execute(
                'INSERT INTO users (name, email, password, dob, profile_image, verification_token) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, hashPassword, dob, profile_image, verificationToken]
            );

            // Send verification email with better error handling
            try {
                await sendVerificationEmail(email, verificationToken);
                res.status(201).json({
                    message: 'User registered successfully. Please check your email for verification.'
                });
            } catch (emailError) {
                // If email fails, still create user but inform about email issue
                console.error('Failed to send verification email:', emailError);
                res.status(201).json({
                    message: 'User registered successfully, but verification email failed to send. Please contact support.'
                });
            }
        } catch (e){
            console.error(e);
            res.status(500).json({message: 'Internal server error'});
        }
    } ,


    // -------------------- LOGIN  -----------------------

    login: async (req, res)=> {
        try{
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({message: 'All fields must be provided'});
            }

            const [users] = await auth_db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({message: 'Invalid email or password'});
            };

            const user = users[0];

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({message: 'Invalid email or password'});
            };

            const token = jwt.sign({
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        );

        res.json({
            token, user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });


        }catch (e){
            console.error(e);
            return res.status(400).json({message: 'Invalid request data'})
        }
    },


    // -------------------- FORGOT PASSWORD  -----------------------



     forgotPassword : async (req, res) => {
        console.log("backend email API hit");
        console.log("email in backend", req.body)
        try {
            const { email } = req.body;
    
            // Validate email input
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
    
            // Fetch user from DB
            const [users] = await auth_db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
    
            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Generate reset token and expiry time
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
    
            // Debugging logs
            // console.log("Generated resetToken:", resetToken);
            // console.log("Generated resetTokenExpiry:", resetTokenExpiry);
    
            if (!resetToken || !resetTokenExpiry) {
                return res.status(500).json({ message: "Token generation failed" });
            }
    
            // Update user in DB with reset token
            const [updateResult] = await auth_db.execute(
                'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
                [resetToken, resetTokenExpiry, email]
            );
    
            if (updateResult.affectedRows === 0) {
                return res.status(500).json({ message: "Failed to update reset token" });
            }
    
           // Send reset email with `/update-password` link
        const resetLink = `http://localhost:5173/update-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Reset your password',
            html: `
                <p>Reset your password</p>
                <p>Click the following link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        });
    
            res.json({ message: 'Reset password link sent to your email. Please check your inbox.' });
    
        } catch (error) {
            console.error("Error in forgotPassword:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    // -------------------- RESET PASSWORD  -----------------------

   
    resetPassword: async (req, res) => {
        console.log("Reset Password triggered in backend");
    
        try {
            const { token, newPassword } = req.body;
    
            // Validate input
            if (!token) {
                return res.status(400).json({ message: "Reset token is required" });
            }
            if (!newPassword || typeof newPassword !== "string") {
                return res.status(400).json({ message: "New password is required and must be a string" });
            }
    
            // Check if token is valid and not expired
            const [rows] = await auth_db.execute(
                'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
                [token]
            );
    
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Invalid or expired token' });
            }
    
            const user = rows[0]; // Correct way to access user data
    
            // Hash the new password
            const hashPassword = await bcrypt.hash(newPassword, 10);
    
            // Update the password in the database
            await auth_db.execute(
                'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
                [hashPassword, user.id] 
            );
    
            res.json({
                message: 'Password reset successfully. Please log in with your new password.'
            });
    
        } catch (e) {
            console.error("Reset password error:", e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    

    // -------------------- UPDATE PASSWORD  -----------------------


    updatePassword: async (req, res)=>{
        try {
            
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;

            const  [user] = await auth_db.execute(
                'SELECT * FROM users WHERE id =?',
                [userId]
            );

            if (user.length === 0) {
                return res.status(404).json({message: 'User not found'});
            };

            const isValidPassword = await bcrypt.compare(oldPassword, user[0].password);
            if (!isValidPassword) {
                return res.status(401).json({message: 'Invalid old password'});
            };

            const hashPassword = await bcrypt.hash(newPassword, 10);
            await auth_db.execute(
                'UPDATE users SET password =? WHERE id =?',
                [hashPassword, userId]
            );

            res.json({
                message: 'Password updated successfully.'
            })

        } catch (e) {
            console.error("update password error ----------------",e);
            return res.status(500).json({message: 'Internal server error'})
            
        }
    }
}

module.exports = authController;