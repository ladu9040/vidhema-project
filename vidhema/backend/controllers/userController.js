



const {userDB} = require('../config/database');
const path = require('path');
const fs = require('fs').promises;
const fss = require('fs');  // Synchronous file operations for directory checking

const userController = {
    createUser: async (req, res) => {
        try {
            const { name, email, dob, password } = req.body;
            let profileImage = null;
    
            if (req.file) {
                const timeStamp = Date.now();
                const ext = path.extname(req.file.originalname);
                const filename = `user_${timeStamp}${ext}`;
    
                // Fix: Use the correct path for uploads directory
                const uploadDir = path.join(__dirname, '../uploads');
                
                // Create directory if it doesn't exist
                if (!fss.existsSync(uploadDir)) {
                    await fs.mkdir(uploadDir, { recursive: true });
                }
    
                // Fix: When using disk storage, the file is already saved
                // Just construct the correct path for database storage
                profileImage = `/uploads/${filename}`;
                
                // If needed, you can move/rename the file
                const oldPath = req.file.path;
                const newPath = path.join(uploadDir, filename);
                
                if (oldPath !== newPath) {
                    await fs.rename(oldPath, newPath);
                }
                
                console.log('Image saved successfully:', newPath);
            }
    
            const [result] = await userDB.execute(
                'INSERT INTO users (name, email, dob, password, profile_image) VALUES (?, ?, ?, ?, ?)',
                [name, email, dob, password, profileImage]
            );
    
            res.status(201).json({ message: 'User created successfully', userId: result.insertId });
        } catch (e) {
            console.log('create user error: ' + e.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    
    getUsers: async (req, res) => {
        console.log("getUsers")
        try{
            const [users] = await userDB.execute(
                'SELECT id, name, email, dob, profile_image FROM users'
            );

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const transformedUsers = users.map(user =>({
                ...user,
                profile_image: user.profile_image? `${baseUrl}${user.profile_image}` : null
            }));
            res.json(transformedUsers);
        }catch(e){
            console.log('get users error: '+ e.message);
            res.status(500).json({message: 'Internal server error'});
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, dob } = req.body;
            let profileImage = null;
    
            // Format the date to YYYY-MM-DD
            const formattedDob = new Date(dob).toISOString().split('T')[0];
    
            // Check if user exists
            const [existingUser] = await userDB.execute(
                'SELECT profile_image FROM users WHERE id = ?',
                [id]
            );
    
            if (existingUser.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Handle profile image upload if present
            if (req.file) {
                const timeStamp = Date.now();
                const ext = path.extname(req.file.originalname);
                const filename = `user_${timeStamp}${ext}`;
    
                const uploadDir = path.join(__dirname, '../uploads');
                if (!fss.existsSync(uploadDir)) {
                    await fs.mkdir(uploadDir, { recursive: true });
                }
    
                // Fix: When using disk storage, the file is already saved
                // Just construct the correct path for database storage
                profileImage = `/uploads/${filename}`;
                
                // If needed, you can move/rename the file
                const oldPath = req.file.path;
                const newPath = path.join(uploadDir, filename);
                
                if (oldPath !== newPath) {
                    await fs.rename(oldPath, newPath);
                }
                
                console.log('Image saved successfully:', newPath);
            }
    
            // Build SQL query
            const query = `UPDATE users SET name = ?, email = ?, dob = ? ${
                profileImage ? ', profile_image = ?' : ''
            } WHERE id = ?`;
    
            // Build parameters array with formatted date
            const params = profileImage 
                ? [name, email, formattedDob, profileImage, id]
                : [name, email, formattedDob, id];
    
            // Execute update query
            await userDB.execute(query, params);
    
            res.json({ message: 'User updated successfully' });
        } catch (e) {
            console.log('update user error: ' + e.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteUser: async (request, res) => {
        try{
            const {id} = request.params;

            const [user] = await userDB.execute(
                'SELECT profile_image FROM users WHERE id =?',
                [id]
            );

            if (user.length === 0) {
                return res.status(404).json({message: 'User not found'});
            }

            if(user[0].profile_image){
                const imagePath = path.join(__dirname, '..', user[0].profile_image);
                try {
                    await fs.unlink(imagePath);
                } catch (e) {
                    console.error('Error deleting image: ', e);
                }
            }

            await userDB.execute(
                'DELETE FROM users WHERE id =?',
                [id]
            );
            res.json({message: 'User deleted successfully'});
        }catch(e){
            console.log('delete user error: '+ e.message);
            res.status(500).json({message: 'Internal server error'});
        }
    }
};

module.exports = userController;