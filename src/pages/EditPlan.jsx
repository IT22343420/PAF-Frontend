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

  // Color variables
  const headerColor = '#4c51bf';        // Indigo shade for header & main buttons
  const labelColor = '#5a67d8';         // Lighter indigo for labels and borders
  const cancelBorderColor = '#a3bffa';  // Light indigo for cancel button border

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: headerColor,
            textDecoration: 'none',
            marginBottom: '15px'
          }}>
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ marginBottom: '20px' }}>
          
          <h1
            className="text-2xl font-bold mb-4 flex items-center gap-2"
            style={{
              fontSize: '27px',
              fontWeight: '700', // Bold plan name
              color: headerColor,
            }}
          >
            Update My Plan
          </h1>
        </div>
        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '15px' }}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: labelColor 
              }}
            >
              Title
            </label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: `1px solid ${labelColor}`, 
                borderRadius: '4px' 
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: labelColor 
              }}
            >
              Description
            </label>
            <textarea
              name="plandesc"
              value={formData.plandesc}
              onChange={handleInputChange}
              required
              rows="4"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: `1px solid ${labelColor}`, 
                borderRadius: '4px' 
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label 
              style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500', 
                color: labelColor 
              }}
            >
              Complete Date
            </label>
            <input
              type="date"
              name="completedate"
              value={formData.completedate}
              onChange={handleInputChange}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: `1px solid ${labelColor}`, 
                borderRadius: '4px' 
              }}
            />
          </div>

          {/* Topics Section */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '25px',
              fontWeight: '700', // Bold plan name
              color: headerColor,
              marginBottom: '20px'
            }}>
              Topics
            </h2>
            {formData.topics.map((topic, index) => (
              <div key={topic.id} style={{ 
                border: `1px solid ${labelColor}`,
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
                    aria-label="Remove topic"
                  >
                    <FaTrash />
                  </button>
                )}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor,
                    fontWeight: '500',
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
                      border: `1px solid ${labelColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor,
                    fontWeight: '500',
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
                      border: `1px solid ${labelColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor,
                    fontWeight: '500',
                  }}>
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={topic.targetDate}
                    onChange={(e) => handleTopicChange(index, 'targetDate', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${labelColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor,
                    fontWeight: '500',
                  }}>
                    Status
                  </label>
                  <select
                    value={topic.status}
                    onChange={(e) => handleTopicChange(index, 'status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${labelColor}`,
                      borderRadius: '4px'
                    }}
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
                backgroundColor: headerColor,
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
              style={{ 
                padding: '8px 16px', 
                border: `1px solid ${cancelBorderColor}`, 
                borderRadius: '4px', 
                cursor: 'pointer', 
                backgroundColor: 'white',
                color: headerColor,
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: headerColor, 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontWeight: '500', 
                opacity: loading ? 0.7 : 1 
              }}
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
