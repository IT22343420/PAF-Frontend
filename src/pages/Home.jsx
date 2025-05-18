import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaThLarge, FaList } from 'react-icons/fa';
import { api } from '../services/api';
import SideNav from './SideNav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

// Helper to display date as YYYY-MM-DD
const displayDate = (dateStr) => dateStr ? dateStr.slice(0, 10) : '';

// Function to get plan status from topics
const getPlanStatusFromTopics = (topics) => {
    if (!topics || topics.length === 0) return 'No Topics';
    const completedCount = topics.filter(t => t.status === 'Completed').length;
    const pendingCount = topics.filter(t => t.status === 'Pending').length;
    const inProgressCount = topics.filter(t => t.status === 'In Progress').length;
    
    if (completedCount === topics.length) return 'Completed';
    if (inProgressCount > 0) return 'In Progress';
    if (pendingCount > 0) return 'Pending';
    return 'Pending';
};

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch all plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const params = new URLSearchParams(location.search);
  if (params.get('create') === 'true') {
    toast.success('Plan created successfully!');
  } else if (params.get('update') === 'true') {
    toast.success('Plan updated successfully!');
  } else if (params.get('delete') === 'true') {
    toast.success('Plan deleted successfully!');
  }

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllPlans();
      setPlans(data);
    } catch (err) {
      setError('Failed to fetch plans. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.deletePlan(planId);
        // Refresh the plans list
        fetchPlans();
        setTimeout(() => {
          navigate('/?delete=true');
        }, 500);
      } catch (err) {
        setError('Failed to delete plan. Please try again later.');
        console.error(err);
      }
    }
  };

  // Filter plans based on status
  const filteredPlans = plans.filter(plan => {
    if (statusFilter === 'All') return true;
    const planStatus = getPlanStatusFromTopics(plan.topics);
    return planStatus === statusFilter;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <p>Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        color: '#dc2626'
      }}>
        <p>{error}</p>
        <button
          onClick={fetchPlans}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f5f6fa] min-h-screen">
      <SideNav />
      <div className="flex-1 p-6 overflow-y-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h1 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2"
            style={{ 
              fontSize: '30px',
              fontWeight: '700'
            }}>
              📋 Learning Plans
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* View Toggle Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '4px',
                backgroundColor: '#f3f4f6',
                padding: '4px',
                borderRadius: '6px'
              }}>
                <button
                  onClick={() => setViewMode('card')}
                  style={{
                    padding: '8px',
                    backgroundColor: viewMode === 'card' ? '#4338ca' : 'transparent',
                    color: viewMode === 'card' ? 'white' : '#4b5563',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px',
                    backgroundColor: viewMode === 'list' ? '#4338ca' : 'transparent',
                    color: viewMode === 'list' ? 'white' : '#4b5563',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaList />
                </button>
              </div>
              <Link 
                to="/create"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#4338ca',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}
              >
                <FaPlus /> Create New Plan
              </Link>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: statusFilter === status ? '#4338ca' : 'white',
                  color: statusFilter === status ? 'white' : '#4b5563',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  boxShadow: statusFilter === status ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (statusFilter !== status) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (statusFilter !== status) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredPlans.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ color: '#6b7280' }}>
                {plans.length === 0 
                  ? 'No plans found. Create your first learning plan!'
                  : `No ${statusFilter.toLowerCase()} plans found.`}
              </p>
            </div>
          ) : viewMode === 'card' ? (
            // Card View
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {filteredPlans.map((plan) => {
                const planStatus = getPlanStatusFromTopics(plan.topics);
                return (
                  <div 
                    key={plan.planId}
                    style={{ 
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)',
                      cursor: 'pointer',
                      ':hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '15px'
                    }}>
                      <h2 style={{ 
                        color: '#1f2937',
                        fontSize: '20px',
                        margin: 0,
                        fontWeight: '700' // Bold plan name
                      }}>
                        {plan.planName}
                      </h2>
                      <span style={{ 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: planStatus === 'Completed' ? '#dcfce7' : 
                                          planStatus === 'In Progress' ? '#dbeafe' : '#fef3c7',
                        color: planStatus === 'Completed' ? '#166534' : 
                               planStatus === 'In Progress' ? '#1e40af' : '#92400e',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {planStatus}
                      </span>
                    </div>

                    <p style={{ 
                      color: '#4b5563',
                      marginBottom: '15px',
                      minHeight: '60px'
                    }}>
                      {plan.plandesc}
                    </p>

                    {/* Display Complete Date */}
                    <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '10px' }}>
                      Complete Date: {displayDate(plan.completedate)}
                    </div>

                    <div style={{ 
                      marginBottom: '20px',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '15px'
                    }}>
                      <h3 style={{ 
                        color: '#4338ca', // Indigo-700 darker
                        fontSize: '16px',
                        marginBottom: '10px',
                        fontWeight: '700'  // Increased weight for heading
                      }}>
                        Topics
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {plan.topics.map((topic) => (
                          <div 
                            key={topic.id}
                            style={{ 
                              padding: '10px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <div style={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '5px'
                            }}>
                              <span style={{ 
                                color: '#1f2937',
                                fontWeight: '500'
                              }}>
                                {topic.name}
                              </span>
                              <span style={{ 
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                backgroundColor: topic.status === 'Completed' ? '#dcfce7' : 
                                                  topic.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                                color: topic.status === 'Completed' ? '#166534' : 
                                      topic.status === 'In Progress' ? '#1e40af' : '#92400e'
                              }}>
                                {topic.status}
                              </span>
                            </div>
                            <div style={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              <span>Target: {displayDate(topic.targetDate)}</span>
                              {topic.resourceLink && (
                                <a 
                                  href={topic.resourceLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#2563eb',
                                    textDecoration: 'none',
                                    ':hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  Resources
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'flex-end'
                    }}>
                      <Link 
                        to={`/view/${plan.planId}`}
                        style={{
                          backgroundColor: '#10b981',            // Green base color
                          color: 'white',
                          padding: '10px 18px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)',
                          transition: 'background-color 0.3s',
                          textDecoration: 'none',
                          userSelect: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'} // Darker green
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10b981'} // Original green
                        aria-label="View plan"
                      >
                        View
                      </Link>
                      <Link 
                      to={`/edit/${plan.planId}`}
                        style={{
                          
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '10px 18px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.4)',
                          transition: 'background-color 0.3s',
                          textDecoration: 'none',
                          userSelect: 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                        aria-label="Edit plan"
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(plan.planId)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '10px 18px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          border: 'none',
                          fontWeight: 600,
                          fontSize: 14,
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                        aria-label="Delete plan"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {filteredPlans.map((plan) => {
                const planStatus = getPlanStatusFromTopics(plan.topics);
                return (
                  <div
                    key={plan.planId}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <h2 style={{ 
                          color: '#1f2937',
                          fontSize: '18px',
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {plan.planName}
                        </h2>
                        <span style={{ 
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: planStatus === 'Completed' ? '#dcfce7' : 
                                          planStatus === 'In Progress' ? '#dbeafe' : '#fef3c7',
                          color: planStatus === 'Completed' ? '#166534' : 
                                 planStatus === 'In Progress' ? '#1e40af' : '#92400e',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {planStatus}
                        </span>
                      </div>
                      <p style={{ 
                        color: '#4b5563',
                        marginBottom: '8px',
                        fontSize: '14px'
                      }}>
                        {plan.plandesc}
                      </p>
                      <div style={{ 
                        display: 'flex',
                        gap: '16px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        <span>Complete Date: {displayDate(plan.completedate)}</span>
                        <span>Topics: {plan.topics.length}</span>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <Link 
                        to={`/view/${plan.planId}`}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        View
                      </Link>
                      <Link 
                        to={`/edit/${plan.planId}`}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(plan.planId)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
