import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Helper function to convert between frontend and backend formats
const convertToBackendFormat = (plan) => {
  return {
    planId: plan.planId,
    planName: plan.planName,
    plandesc: plan.plandesc,
    completedate: plan.completedate,
    topic: plan.topics?.[0]?.name || '', // Take first topic name or empty string
    resourceLink: plan.topics?.[0]?.resourceLink || '', // Take first topic resource link or empty string
    status: plan.status === 'Completed', // Convert string status to boolean
    targetdate: plan.topics?.[0]?.targetDate || plan.targetdate, // Take first topic target date or plan target date
    createddate: plan.createddate,
    updateddate: new Date().toISOString()
  };
};

// Helper function to convert from backend to frontend format
const convertToFrontendFormat = (plan) => {
  return {
    planId: plan.planId || plan._id, // Use planId if present, otherwise _id from MongoDB
    planName: plan.planName,
    plandesc: plan.plandesc,
    completedate: plan.completedate,
    targetdate: plan.targetdate,
    status: plan.status ? 'Completed' : 'Pending',
    createddate: plan.createddate,
    updateddate: plan.updateddate,
    topics: [{
      id: 1,
      name: plan.topic || '',
      resourceLink: plan.resourceLink || '',
      targetDate: plan.targetdate,
      status: plan.status ? 'Completed' : 'Pending'
    }]
  };
};

// API functions
export const api = {
  // Get all plans
  getAllPlans: async () => {
    try {
      const response = await axios.get('/fetchPlans');
      return response.data.map(convertToFrontendFormat);
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  // Get single plan
  getPlan: async (id) => {
    try {
      const response = await axios.get(`/getPlan/${id}`);
      return convertToFrontendFormat(response.data);
    } catch (error) {
      console.error(`Error fetching plan ${id}:`, error);
      throw error;
    }
  },

  // Create new plan
  createPlan: async (plan) => {
    try {
      const backendPlan = convertToBackendFormat(plan);
      await axios.post('/addPlan', backendPlan);
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },

  // Update plan
  updatePlan: async (plan) => {
    try {
      const backendPlan = convertToBackendFormat(plan);
      await axios.put('/updatePlan', backendPlan);
    } catch (error) {
      console.error(`Error updating plan ${plan.planId}:`, error);
      throw error;
    }
  },

  // Delete plan
  deletePlan: async (id) => {
    try {
      await axios.delete(`/deletePlan/${id}`);
    } catch (error) {
      console.error(`Error deleting plan ${id}:`, error);
      throw error;
    }
  }
}; 