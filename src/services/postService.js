import axios from "axios";
export default class PostService {

    static BASE_URL = "http://localhost:8080/api/posts";


    /**  Posts API */

    static async addPost(postData) {
        const response = await axios.post(`${this.BASE_URL}/add`, postData, {
            headers: {
                'Accept': 'application/json'
            }
        });
        return response;
    }

    static async getPosts() {
        const response = await axios.get(`${this.BASE_URL}/find/all`, {
            "Content-Type": "application/json"
        });
        return response;
    }


    static async findPostById(postId) {
        const response = await axios.get(`${this.BASE_URL}/find/${postId}`, {
            "Content-Type": "application/json"
        });
        return response;
    }

    static async updatePost(postId, postData) {
        const response = await axios.put(`${this.BASE_URL}/update/${postId}`, postData, {
            headers: {
                'Accept': 'application/json'
            }
        });
        return response;
    }

    static async deletePostById(postId) {
        const response = await axios.delete(`${this.BASE_URL}/delete/${postId}`, {
            "Content-Type": "application/json"
        });
        return response;
    }
}