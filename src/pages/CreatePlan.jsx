import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const CreatePlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: '',
    plandesc: '',
    completedate: '',
    targetdate: '',
    status: '',
    topics: [{
      id: Date.now(),
      name: '',
      resourceLink: '',
      targetDate: '',
      status: 'Pending',

    }]
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
          status: ''
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

  const toISODate = (dateStr) => {
    if (dateStr && dateStr.includes('T')) return dateStr;
    return dateStr ? new Date(dateStr).toISOString() : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const now = new Date();
    const newPlan = {
      ...formData,
      planId: Date.now(),
      completedate: toISODate(formData.completedate),
      targetdate: toISODate(formData.targetdate),
      createddate: toISODate(formData.createddate) || now.toISOString(),
      updateddate: now.toISOString(),
    };

    try {
      await api.createPlan(newPlan);
      navigate('/');
    } catch (err) {
      setError('Failed to create plan. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Common indigo shades
  const headerColor = '#4f46e5'; // Indigo 700
  const labelColor = '#4338ca';  // Indigo 600
  const borderColor = '#4338ca'; // Indigo 600
  const cancelBorderColor = '#4338ca'; // Indigo 300

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
            className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2"
            style={{ 
              fontSize: '27px',
              fontWeight: '700',
            }}
          >
            New Learning Plan
          </h1>
        </div>

        {error && (
          <div style={{ 
            padding: '10px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: labelColor
            }}>
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
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: labelColor
            }}>
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
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: labelColor
            }}>
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
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            {formData.topics.map((topic, index) => (
              <div 
                key={topic.id}
                style={{ 
                  marginBottom: '15px',
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <h3 style={{ 
                        fontSize: '20px',
                        fontWeight: '700',
                        color: headerColor,
                      }}>Topic {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    style={{
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={topic.name}
                    onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor
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
                      border: `1px solid ${borderColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: labelColor
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
                      border: `1px solid ${borderColor}`,
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
  <label style={{ 
    display: 'block', 
    marginBottom: '5px', 
    fontWeight: '500',
    color: labelColor
  }}>
    Plan Status
  </label>
  <select
    name="status"
    value={formData.status}
    onChange={handleInputChange}
    required
    style={{
      width: '100%',
      padding: '8px',
      border: `1px solid ${borderColor}`,
      borderRadius: '4px'
    }}
  >
    <option value="">Select Status</option>
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
                backgroundColor: '#4338ca', // Darker indigo
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              <FaPlus style={{ marginRight: '6px' }} />
              Add Topic
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <Link 
              to="/" 
              style={{ 
                padding: '8px 20px',    // Smaller padding here too
                borderRadius: '6px',
                border: `2px solid ${cancelBorderColor}`,
                color: cancelBorderColor,
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: 'white',
                minWidth: '120px',      // Optional for consistent width
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: headerColor,
                color: 'white',
                padding: '8px 20px',     // Smaller padding here
                borderRadius: '6px',
                border: 'none',
                fontWeight: '700',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                minWidth: '120px',       // Optional: keep a minimum width
              }}
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
            
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePlan;
