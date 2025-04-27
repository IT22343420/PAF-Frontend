import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Helper to display date as YYYY-MM-DD
const displayDate = (dateStr) => dateStr ? dateStr.slice(0, 10) : '';

// Helper to convert date to ISO string
const toISODate = (dateStr) => {
  if (dateStr && dateStr.includes('T')) return dateStr;
  return dateStr ? new Date(dateStr).toISOString() : null;
};

const EditPlan = () => {
  const { id } = useParams(); // planId from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await api.getPlan(id);
        // Convert ISO dates to YYYY-MM-DD for input fields
        setFormData({
          ...data,
          completedate: displayDate(data.completedate),
          targetdate: displayDate(data.targetdate),
          createddate: displayDate(data.createddate),
          updateddate: displayDate(data.updateddate),
        });
      } catch (err) {
        setError('Failed to fetch plan.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const now = new Date();
    const updatedPlan = {
      ...formData,
      completedate: toISODate(formData.completedate),
      targetdate: toISODate(formData.targetdate),
      createddate: toISODate(formData.createddate) || now.toISOString(),
      updateddate: now.toISOString(),
    };
    try {
      await api.updatePlan(updatedPlan);
      navigate('/');
    } catch (err) {
      setError('Failed to update plan. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: '#dc2626' }}>{error}</div>;
  if (!formData) return <div>Plan not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#2563eb',
            textDecoration: 'none'
          }}>
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ marginTop: '10px', color: '#1f2937' }}>
            Edit Learning Plan
          </h1>
        </div>
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Title</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Description</label>
            <textarea
              name="plandesc"
              value={formData.plandesc}
              onChange={handleInputChange}
              required
              rows="4"
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Complete Date</label>
            <input
              type="date"
              name="completedate"
              value={formData.completedate}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Resource Link</label>
            <input
              type="url"
              name="resourceLink"
              value={formData.resourceLink}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Target Date</label>
            <input
              type="date"
              name="targetdate"
              value={formData.targetdate}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              <option value={true}>Completed</option>
              <option value={false}>Pending</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Updating...' : 'Update Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlan; 