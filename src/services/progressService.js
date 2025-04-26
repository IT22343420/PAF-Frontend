import axios from "axios";

const API_URL = "http://localhost:8080/api/progress";

export const createProgress = (progressData) => {
  return axios.post(API_URL, progressData);
};

export const getAllProgress = () => {
  return axios.get(API_URL);
};

export const getUserProgress = (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

export const updateProgress = (id, progressData) => {
  return axios.put(`${API_URL}/${id}`, progressData);
};

export const deleteProgress = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
