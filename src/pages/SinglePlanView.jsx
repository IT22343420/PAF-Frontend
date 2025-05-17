import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaEdit, FaTrash, FaLink, FaArrowLeft } from 'react-icons/fa';

const SinglePlanView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get status based on topics
  const getPlanStatusFromTopics = (topics) => {
    if (!topics || topics.length === 0) return 'No Topics';
    const completedCount = topics.filter(t => t.status === 'Completed').length;
    const pendingCount = topics.filter(t => t.status === 'Pending').length;
    const inProgressCount = topics.filter(t => t.status === 'In Progress').length;
    if (completedCount === topics.length) return 'Completed';
    if (inProgressCount !== 0) return 'In Progress';
    if (completedCount !== 0 && pendingCount !== 0) return 'Pending';
    return 'Pending';
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await api.getPlan(id);
        setPlan(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch plan.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.deletePlan(plan.planId);
        navigate('/');
      } catch (err) {
        setError('Failed to delete plan.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '3rem', color: '#dc2626' }}>{error}</div>;
  if (!plan) return <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280' }}>Plan not found</div>;

  const progress = plan.topics && plan.topics.length > 0
    ? Math.round((plan.topics.filter(topic => topic.status === 'Completed').length / plan.topics.length) * 100)
    : 0;

  const planStatus = getPlanStatusFromTopics(plan.topics);

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Back Button */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#2563eb',
            marginBottom: 24,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
            userSelect: 'none',
            gap: 8
          }}
        >
          <FaArrowLeft />
          Back to Plans
        </Link>

        {/* Plan Header */}
        <section
          style={{
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: 24,
            marginBottom: 24,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }}
          aria-labelledby="plan-title"
        >
          <header style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2"
                style={{ fontSize: '30px', fontWeight: '700' }}>
                {plan.planName}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14, color: '#4b5563' }}>
                
                <time dateTime={plan.createddate}>{`Created: ${plan.createddate ? plan.createddate.slice(0, 10) : '-'}`}</time>
                <time dateTime={plan.updateddate}>{`Last Updated: ${plan.updateddate ? plan.updateddate.slice(0, 10) : '-'}`}</time>
                <time style={{ fontSize: '16px', fontWeight: '600' }} dateTime={plan.completedate}>{`Complete Date: ${plan.completedate ? plan.completedate.slice(0, 10) : '-'}`}</time>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor:
                      planStatus === 'Completed' ? '#dcfce7' :
                      planStatus === 'In Progress' ? '#dbeafe' : '#fef3c7',
                    color:
                      planStatus === 'Completed' ? '#166534' :
                      planStatus === 'In Progress' ? '#1e40af' : '#92400e',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                  aria-label={`Plan status: ${planStatus}`}
                >
                  {planStatus}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                minWidth: 200,
              }}
            >
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
                <FaEdit />
                Edit Plan
              </Link>
              <button
                type="button"
                onClick={handleDelete}
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
                <FaTrash />
                Delete Plan
              </button>
            </div>
          </header>

          <p
            style={{
              color: '#4b5563',
              fontSize: 18,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              fontWeight: '600'
            }}
          >
            {plan.plandesc || 'No description provided.'}
          </p>

          {/* Progress Section */}
          <section aria-label="Progress" style={{ marginBottom: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                marginBottom: 8,
                color: '#6b7280',
                fontWeight: 600,
              }}
            >
              <span>Overall Progress</span>
              <span style={{ color: '#1f2937' }}>{progress}%</span>
            </div>
            <div
              style={{
                width: '100%',
                background: '#e5e7eb',
                borderRadius: 8,
                height: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: '#2563eb',
                  height: '100%',
                  borderRadius: 8,
                  width: `${progress}%`,
                  transition: 'width 1s ease-out',
                }}
              />
            </div>
          </section>
        </section>

        {/* Topics Section */}
        <section
          aria-labelledby="topics-title"
          style={{
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: 24,
            border: '1px solid #e5e7eb',
          }}
        >
          <h2
            id="topics-title"
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#4338ca',
              marginBottom: '20px'
            }}
          >
            Topics
          </h2>

          {plan.topics && plan.topics.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {plan.topics.map((topic) => (
                <article
                  key={topic.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: 16,
                    background: '#f9fafb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'border-color 0.2s',
                  }}
                  tabIndex={0}
                  aria-label={`Topic: ${topic.name}, status: ${topic.status}`}
                >
                  <header
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: 0,
                      }}
                    >
                      {topic.name}
                    </h3>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                        backgroundColor:
                          topic.status === 'Completed'
                            ? '#dcfce7'
                            : topic.status === 'In Progress'
                            ? '#dbeafe'
                            : '#fef3c7',
                        color:
                          topic.status === 'Completed'
                            ? '#166534'
                            : topic.status === 'In Progress'
                            ? '#1e40af'
                            : '#92400e',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                      }}
                      aria-label={`Status: ${topic.status}`}
                    >
                      {topic.status}
                    </span>
                  </header>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#2563eb',
                      marginBottom: 6,
                      gap: 6,
                    }}
                  >
                    <FaLink />
                    <a
                      href={topic.resourceLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 600,
                        wordBreak: 'break-word',
                      }}
                      aria-label={`Resource link for ${topic.name}`}
                    >
                      Resource Link
                    </a>
                  </div>

                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    Target Date: {topic.targetDate ? topic.targetDate.slice(0, 10) : 'N/A'}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No topics available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SinglePlanView;
