        // frontend/src/api.js
        import axios from 'axios';

        // Set the base URL for non-admin API requests
        const API = axios.create({
          baseURL: 'http://localhost:5000/api', // Your backend API base URL (excluding /admin)
        });

        // Interceptor to automatically add the USER token to requests
        API.interceptors.request.use((req) => {
          const userInfoString = localStorage.getItem('userInfo'); // Get user info string
          if (userInfoString) {
            try {
              const userInfo = JSON.parse(userInfoString);
              if (userInfo && userInfo.token) {
                // Add the Authorization header if token exists
                req.headers.Authorization = `Bearer ${userInfo.token}`;
              }
            } catch (error) {
              console.error("Error parsing userInfo from localStorage:", error);
              // Optionally clear invalid storage item
              // localStorage.removeItem('userInfo');
            }
          }
          return req; // Continue with the request
        });

        export default API;
        


        