import axios from "axios";
export default class PostService {

    static BASE_URL = "http://localhost:8080/api/posts";


    /**  Posts API */

    static async addPost(postData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/add`, postData, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error('Error adding post:', error);
            throw error;
        }
    }

    static async getPosts() {
        try {
            const response = await axios.get(`${this.BASE_URL}/find/all`, {
                "Content-Type": "application/json"
            });
            return response;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }


    static async findPostById(postId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/find/${postId}`, {
                "Content-Type": "application/json"
            });
            return response;
        } catch (error) {
            console.error(`Error finding post with ID ${postId}:`, error);
            throw error;
        }
    }

    static async updatePost(postId, postData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/update/${postId}`, postData, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error(`Error updating post with ID ${postId}:`, error);
            throw error;
        }
    }

    static async deletePostById(postId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/delete/${postId}`, {
                "Content-Type": "application/json"
            });
            return response;
        } catch (error) {
            console.error(`Error deleting post with ID ${postId}:`, error);
            throw error;
        }
    }
}