import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/notifications'; 

export default class NotificationService {

    static BASE_URL = BASE_URL;

    static async addNotification(notificationData) {
        try {
            const response = await axios.post(`${this.BASE_URL}`, notificationData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error('Error adding notification:', error);
            throw error;
        }
    }

    static async getNotificationById(id) {
        try {
            const response = await axios.get(`${this.BASE_URL}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error finding notification with ID ${id}:`, error);
            throw error;
        }
    }

    static async getAllNotifications() {
        try {
            const response = await axios.get(`${this.BASE_URL}`);
            return response;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    static async updateNotification(id, notificationData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/${id}`, notificationData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response;
        } catch (error) {
            console.error(`Error updating notification with ID ${id}:`, error);
            throw error;
        }
    }

    static async deleteNotification(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting notification with ID ${id}:`, error);
            throw error;
        }
    }

    static async deleteAllNotifications() {
        try {
            const response = await axios.delete(`${this.BASE_URL}`);
            return response;
        } catch (error) {
            console.error('Error deleting all notifications:', error);
            throw error;
        }
    }
} 