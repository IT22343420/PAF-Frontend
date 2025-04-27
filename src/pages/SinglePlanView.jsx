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

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await api.getPlan(id);
        console.log('Fetched plan:', data); // <--- Check this in your browser console
        setPlan(data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#dc2626' }}>{error}</div>;
  if (!plan) return <div>Plan not found</div>;

  const progress = plan.topics && plan.topics.length > 0
    ? Math.round(
        (plan.topics.filter(topic => topic.status === 'Completed').length / plan.topics.length) * 100
      )
    : 0;

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Button */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#2563eb',
            marginBottom: '24px',
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back to Plans
        </Link>

        {/* Plan Header */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>
                {plan.planName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#4b5563' }}>
                  Complete Date: {plan.completedate ? plan.completedate.slice(0, 10) : ''}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: plan.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                  color: plan.status === 'Completed' ? '#166534' : '#92400e'
                }}>
                  {plan.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to={`/edit/${plan.planId}`}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  fontWeight: 500,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                }}
              >
                <FaEdit style={{ marginRight: '8px' }} /> Edit Plan
              </Link>
              <button
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  fontWeight: 500,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  cursor: 'pointer'
                }}
                onClick={handleDelete}
              >
                <FaTrash style={{ marginRight: '8px' }} /> Delete Plan
              </button>
            </div>
          </div>

          <p style={{ color: '#4b5563', marginBottom: '24px' }}>
            {plan.plandesc}
          </p>

          {/* Progress Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Overall Progress</span>
              <span style={{ fontWeight: 600, color: '#1f2937' }}>{progress}%</span>
            </div>
            <div style={{ width: '100%', background: '#f3f4f6', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  background: '#2563eb',
                  height: '10px',
                  borderRadius: '8px',
                  width: `${progress}%`,
                  transition: 'width 1s ease-out'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>
            Topics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plan.topics && plan.topics.map((topic) => (
              <div
                key={topic.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  transition: 'border-color 0.2s',
                  background: '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1f2937' }}>
                    {topic.name}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: topic.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                    color: topic.status === 'Completed' ? '#166534' : '#92400e'
                  }}>
                    {topic.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#2563eb', marginBottom: '6px' }}>
                  <FaLink style={{ marginRight: '6px' }} />
                  <a
                    href={topic.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Resource Link
                  </a>
                </div>

                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Target Date: {topic.targetDate ? topic.targetDate.slice(0, 10) : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlanView; 