import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Helper to display date as YYYY-MM-DD
const displayDate = (dateStr) => dateStr ? dateStr.slice(0, 10) : '';

// Helper to convert date to ISO string
const toISODate = (dateStr) => {
  if (dateStr && dateStr.includes('T')) return dateStr;
  return dateStr ? new Date(dateStr).toISOString() : null;
};

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await api.getPlan(id);
        setFormData({
          ...data,
          completedate: displayDate(data.completedate),
          targetdate: displayDate(data.targetdate),
          createddate: displayDate(data.createddate),
          updateddate: displayDate(data.updateddate),
          topics: data.topics || [{
            id: Date.now(),
            name: '',
            resourceLink: '',
            targetDate: '',
            status: 'Pending'
          }]
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

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      topics: updatedTopics,
    });
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [
        ...formData.topics,
        {
          id: Date.now(),
          name: '',
          resourceLink: '',
          targetDate: '',
          status: 'Pending'
        },
      ],
    });
  };

  const removeTopic = (index) => {
    const updatedTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      topics: updatedTopics,
    });
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
      createddate: toISODate(formData.createddate),
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

          {/* Topics Section */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ 
              color: '#1f2937',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Topics
            </h2>
            {formData.topics.map((topic, index) => (
              <div key={topic.id} style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                position: 'relative'
              }}>
                {formData.topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#374151'
                  }}>
                    Topic Name
                  </label>
                  <input
                    type="text"
                    value={topic.name}
                    onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#374151'
                  }}>
                    Resource Link
                  </label>
                  <input
                    type="url"
                    value={topic.resourceLink}
                    onChange={(e) => handleTopicChange(index, 'resourceLink', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#374151'
                  }}>
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="targetdate"
                    value={topic.targetDate}
                    onChange={(e) => handleTopicChange(index, 'targetDate', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#374151'
                  }}>
                    Status
                  </label>
                  <select
                    value={topic.status}
                    onChange={(e) => handleTopicChange(index, 'status', e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTopic}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <FaPlus /> Add Topic
            </button>
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