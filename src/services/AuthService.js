import axios from 'axios';

export default class AuthService {
    static API_URL = "http://localhost:8080/api/auth";

    static async registerUser(registerRequest) {
        try {
            const response = await axios.post(`${this.API_URL}/register`, registerRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response; 
        } catch (error) {
            console.error('Error registering user:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    static async loginUser(loginRequest) {
        try {
            const response = await axios.post(`${this.API_URL}/login`, loginRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error('Error logging in user:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}
