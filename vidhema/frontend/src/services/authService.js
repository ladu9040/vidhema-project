import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

const authService = {

    
    // sign up

    signup: async (formData) => {
        try {
            // Remove confirmPassword before sending to server
            const {  ...signupData } = formData;
            
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            // Get the response text first
            const responseText = await response.text();
            
            // Log the full response for debugging
            console.log('Server response:', responseText);

            if (!response.ok) {
                // Try to parse the error message if it's JSON
                let errorMessage;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || 'Signup failed';
                } catch {
                    errorMessage = responseText || `HTTP error! status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            // Try to parse the success response
            try {
                return JSON.parse(responseText);
            } catch {
                return { message: 'Signup successful' };
            }
        } catch (error) {
            console.error('Signup error details:', error);
            throw error;
        }
    },

    // login

    // login: async (userCredentials) => {
    //     try {
            
    //         const response = await axios.post(`${API_URL}/login`, userCredentials);
    //         console.log("login successful", response);
    //         if(response.data.token){
    //             localStorage.setItem('token', response.data.token);
    //             localStorage.setItem('user', JSON.stringify(response.data.user));
    //         }
    //         return response.data;
    //     } catch (e) {
    //         throw e.response?.data || {message: 'An error occurred'};
    //     }
    // },

    login: async (userCredentials) => {
        try {
            console.log("Sending login request with:", userCredentials);
            const response = await axios.post(`${API_URL}/login`, userCredentials, {
                withCredentials: true,
            });
            console.log("Login successful", response);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (e) {
            throw e.response?.data || { message: 'An error occurred' };
        }
    },


    // forgot password

    forgotPassword: async (email) => {
        try {
            console.log("frontend email api hitted");
            const response = await axios.post(`${API_URL}/forgot-password`, {email});
            return response.data;
        }catch(e){
            throw e.response?.data || {message: 'An error occurred'};
        }
    },


    // reset password

    resetPassword: async (newPassword, token) => {
        console.log("in app service", newPassword, token);
        try{
            const response = await axios.post(`${API_URL}/reset-password`,{
                token,
                newPassword
            });
            return response.data;
        }catch(e){
            throw e.response?.data || {message: 'An error occurred'};
        }
    },

    // updatePassword: async ( newPassword) => {
    //     console.log("update password in frontend is clicked")
    //     try{
    //         const token = localStorage.getItem('token');
    //         const response = await axios.post(`${API_URL}/update-password`,{
              
    //             newPassword
    //         },{
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         return response.data;
    //     }catch(e){
    //         throw e.response?.data || {message: 'An error occurred'};
    //     }
    // },

    //  get current user 

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // checking if user is logged in or not

    isAuthenticated: ()=>{
        return !!localStorage.getItem('token');
    }
       
};

// axios interceptor request for adding auth token to  requests

axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error)=>{
    return Promise.reject(error);
}
)

export default authService;