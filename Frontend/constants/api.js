import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://9969-61-245-161-118.ngrok-free.app', // Replace with your backend URL
  timeout: 10000, // Timeout in milliseconds
});

export default apiClient;