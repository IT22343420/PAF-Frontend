import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Home = () => {
  // Sample data for testing
  const plans = [
    {
      planId: 1,
      planName: "Sample Plan 1",
      plandesc: "This is a sample plan description",
      completedate: "2024-04-27",
      targetdate: "2024-05-27",
      status: "Pending",
      topics: [
        {
          id: 1,
          name: "React Basics",
          resourceLink: "https://example.com",
          targetDate: "2024-05-01",
          status: "In Progress"
        },
        {
          id: 2,
          name: "React Hooks",
          resourceLink: "https://example.com",
          targetDate: "2024-05-15",
          status: "Pending"
        },
        {
          id: 3,
          name: "React Router",
          resourceLink: "https://example.com",
          targetDate: "2024-05-27",
          status: "Pending"
        }
      ]
    },
    {
      planId: 2,
      planName: "Sample Plan 2",
      plandesc: "Another sample plan description",
      completedate: "2024-04-28",
      targetdate: "2024-05-28",
      status: "Completed",
      topics: [
        {
          id: 1,
          name: "JavaScript Basics",
          resourceLink: "https://example.com",
          targetDate: "2024-04-28",
          status: "Completed"
        },
        {
          id: 2,
          name: "ES6 Features",
          resourceLink: "https://example.com",
          targetDate: "2024-04-28",
          status: "Completed"
        }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          color: '#1f2937',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Learning Plans
        </h1>
        <Link 
          to="/create"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          <FaPlus /> Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#6b7280' }}>
            No plans found. Create your first learning plan!
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {plans.map((plan) => (
            <div 
              key={plan.planId}
              style={{ 
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }
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
                  margin: 0
                }}>
                  {plan.planName}
                </h2>
                <span style={{ 
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: plan.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                  color: plan.status === 'Completed' ? '#166534' : '#92400e',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {plan.status}
                </span>
              </div>

              <p style={{ 
                color: '#4b5563',
                marginBottom: '15px',
                minHeight: '60px'
              }}>
                {plan.plandesc}
              </p>

              <div style={{ 
                marginBottom: '20px',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '15px'
              }}>
                <h3 style={{ 
                  color: '#1f2937',
                  fontSize: '16px',
                  marginBottom: '10px',
                  fontWeight: '500'
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
                        <span>Target: {topic.targetDate}</span>
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
                  to={`/edit/${plan.planId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 