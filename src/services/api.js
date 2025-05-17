import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

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
    topic: plan.topics?.[0]?.name || '', 
    resourceLink: plan.topics?.[0]?.resourceLink || '', 
    status: plan.status || '',
    targetdate: plan.topics?.[0]?.targetDate || plan.targetdate,
    createddate: plan.createddate,
    updateddate: plan.updateddate || new Date().toISOString() 
  };
};

// Helper function to convert from backend to frontend format
const convertToFrontendFormat = (plan) => {
  return {
    planId: plan.planId || plan._id,
    planName: plan.planName,
    plandesc: plan.plandesc,
    completedate: plan.completedate ? plan.completedate.slice(0, 10) : '',
    targetdate: plan.targetdate ? plan.targetdate.slice(0, 10) : '',
    status: plan.status,
    createddate: plan.createddate,
    updateddate: plan.updateddate,
    topics: [{
      id: 1,
      name: plan.topic || '',
      resourceLink: plan.resourceLink || '',
      targetDate: plan.targetdate ? plan.targetdate.slice(0, 10) : '',
      status: plan.status,
    }]
  };
};


// API functions
export const api = {

  // ============================ LEARNING PLAN APIS ==============================

  // Get all plans
  getAllPlans: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plans`);
      return response.data.map(convertToFrontendFormat);
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  // Get single plan
  getPlan: async (id) => {
    try {
      const response = await axios.get(`/plans/${id}`);
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
      await axios.post('/plans', backendPlan);
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },

  // Update plan
  updatePlan: async (plan) => {
    try {
      const backendPlan = convertToBackendFormat(plan);
      await axios.put(`/plans/${plan.planId}`, backendPlan);
    } catch (error) {
      console.error(`Error updating plan ${plan.planId}:`, error);
      throw error;
    }
  },

  // Delete plan
  deletePlan: async (id) => {
    try {
      await axios.delete(`/plans/${id}`);
    } catch (error) {
      console.error(`Error deleting plan ${id}:`, error);
      throw error;
    }
  },

  // =================== BADGE APIs ===================

  getAllBadges: async () => {
  try {
    const response = await axios.get('/badges');
    return response.data;
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }
},

  claimBadge: async (badgeId) => {
  try {
    await axios.put(`/badges/${badgeId}/claim`);
  } catch (error) {
    console.error(`Error claiming badge ${badgeId}:`, error);
    throw error;
  }
},

  createBadge: async (badge) => {
    try {
      await axios.post('/badges', badge);
    } catch (error) {
      console.error('Error creating badge:', error);
      throw error;
    }
  }

}; 