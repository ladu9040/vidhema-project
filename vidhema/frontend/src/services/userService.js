import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users';

const userService = {
    // Create user
    createUser: async (userData) => {
        try {
          const formData = new FormData();
          formData.append('name', userData.name);
          formData.append('email', userData.email);
          formData.append('dob', userData.dob);
          formData.append('password', userData.password);
          
          // Convert base64 image to file if it exists
          if (userData.profileImage && userData.profileImage.startsWith('data:')) {
            const response = await fetch(userData.profileImage);
            const blob = await response.blob();
            const fileName = `profile_${Date.now()}.jpg`;
            const file = new File([blob], fileName, { type: blob.type });
            formData.append('profileImage', file); // Match the field name in the route
          }

         
          
          const response = await fetch('/api/users', {
            method: 'POST',
            body: formData,
            headers: {
              // Include authorization header if needed
              'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
          
          return await response.json();
        } catch (error) {
          console.error('Error in createUser service:', error);
          throw error;
        }
      },

    // Update user
    updateUser: async (id, formData) => {
        console.log("id", id, "formdata", formData);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred' };
        }
    },

    // Get all users

    getUsers: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching users from:', API_URL);
            console.log('Using token:', token);

            const response = await axios.get(API_URL, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log('Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('Detailed error in getUsers:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    },


    // Delete user
    deleteUser: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'An error occurred' };
        }
    },

       // Logout user
       logout: async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.clear();
            delete axios.defaults.headers.common['Authorization'];
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            throw { message: 'Failed to logout properly' };
        }
    }
};

export default userService;
