import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function EmailVerification() {
    const { token } = useParams();
    console.log("EmailVerification token", token);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/auth/verify/${token}`);
                const data = await response.json(); // Parse JSON response
                console.log("API Response:", data);

                if (response.ok) {
                    console.log("Navigating to login...");
                    setTimeout(() => {
                        navigate('/login?verified=true');
                    }, 2000); // 2-second delay before navigating
                } else {
                    console.error("Verification failed:", data.message);
                }
            } catch (error) {
                console.error('Verification failed:', error);
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return <div>Verifying your email...</div>;
}

export default EmailVerification;
