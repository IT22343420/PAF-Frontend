import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const CreatePlan = () => {
  const navigate = useNavigate();
  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert date to ISO string for backend
  const toISODate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) return dateStr;
    return new Date(dateStr).toISOString();
  };

  // Input handlers
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

  // Add new empty topic
  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        {
          id: Date.now(),
          name: '',
          resourceLink: '',
          targetDate: '',
          status: 'Pending',
        },
      ],
    }));
  };

  // Remove topic by index
  const removeTopic = (index) => {
    const updatedTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      topics: updatedTopics.length ? updatedTopics : [{
        id: Date.now(),
        name: '',
        resourceLink: '',
        targetDate: '',
        status: 'Pending',
      }],
    });
  };

  // Clear all form inputs
  const clearAll = () => {
    setFormData(initialFormData);
    setError(null);
  };

  // Validate form before submit
  const validateForm = () => {
    if (!formData.planName.trim()) {
      toast.error('Title is required.');
      return false;
    }
    if (!formData.plandesc.trim()) {
      toast.error('Description is required.');
      return false;
    }
    if (!formData.completedate) {
      toast.error('Complete Date is required.');
      return false;
    }
    if (!formData.status) {
      toast.error('Plan Status is required.');
      return false;
    }
    for (let i = 0; i < formData.topics.length; i++) {
      const topic = formData.topics[i];
      if (!topic.name.trim()) {
        toast.error(`Topic ${i + 1}: Name is required.`);
        return false;
      }
      if (!topic.targetDate) {
        toast.error(`Topic ${i + 1}: Target Date is required.`);
        return false;
      }
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const now = new Date();

    const newPlan = {
      ...formData,
      planId: Date.now(),
      completedate: toISODate(formData.completedate),
      targetdate: toISODate(formData.targetdate),
      createddate: now.toISOString(),
      updateddate: now.toISOString(),
    };

    try {
      await api.createPlan(newPlan);
      toast.success('Plan created successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to create plan. Please try again later.');
      toast.error('Failed to create plan. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Colors (same as before)
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
        <h1
          className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2"
          style={{
            fontSize: '27px',
            fontWeight: '700',
          }}
        >
          New Learning Plan
        </h1>

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

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="planName" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: labelColor
            }}>
              Title
            </label>
            <input
              id="planName"
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-invalid={formData.planName.trim() === '' ? "true" : "false"}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="plandesc" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: labelColor
            }}>
              Description
            </label>
            <textarea
              id="plandesc"
              name="plandesc"
              value={formData.plandesc}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-invalid={formData.plandesc.trim() === '' ? "true" : "false"}
              rows="4"
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
              disabled={loading}
            />
          </div>

          {/* Complete Date */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="completedate" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: labelColor
            }}>
              Complete Date
            </label>
            <input
              id="completedate"
              type="date"
              name="completedate"
              value={formData.completedate}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-invalid={!formData.completedate ? "true" : "false"}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
              disabled={loading}
            />
          </div>

          {/* Topics */}
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
                    aria-label={`Remove Topic ${index + 1}`}
                    disabled={loading}
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

                {/* Topic Name */}
                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor={`topic-name-${topic.id}`} style={{
                    display: 'block',
                    marginBottom: '5px',
                    color: labelColor
                  }}>
                    Name
                  </label>
                  <input
                    id={`topic-name-${topic.id}`}
                    type="text"
                    value={topic.name}
                    onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={topic.name.trim() === '' ? "true" : "false"}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '4px'
                    }}
                    disabled={loading}
                  />
                </div>

                {/* Resource Link */}
                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor={`topic-resource-${topic.id}`} style={{
                    display: 'block',
                    marginBottom: '5px',
                    color: labelColor
                  }}>
                    Resource Link
                  </label>
                  <input
                    id={`topic-resource-${topic.id}`}
                    type="url"
                    value={topic.resourceLink}
                    onChange={(e) => handleTopicChange(index, 'resourceLink', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '4px'
                    }}
                    disabled={loading}
                  />
                </div>

                {/* Topic Target Date */}
                <div style={{ marginBottom: '10px' }}>
                  <label htmlFor={`topic-target-${topic.id}`} style={{
                    display: 'block',
                    marginBottom: '5px',
                    color: labelColor
                  }}>
                    Target Date
                  </label>
                  <input
                    id={`topic-target-${topic.id}`}
                    type="date"
                    value={topic.targetDate}
                    onChange={(e) => handleTopicChange(index, 'targetDate', e.target.value)}
                    required
                    aria-required="true"
                    aria-invalid={!topic.targetDate ? "true" : "false"}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '4px'
                    }}
                    disabled={loading}
                  />
                </div>
                {/* Status */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="status" style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: labelColor
            }}>
              Plan Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-invalid={!formData.status ? "true" : "false"}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${borderColor}`,
                borderRadius: '4px'
              }}
              disabled={loading}
            >
              <option value="" disabled>-- Select Status --</option>
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
              disabled={loading}
              style={{
                backgroundColor: headerColor,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                border: 'none',
              }}
            >
              <FaPlus /> Add Topic
            </button>
          </div>

          

          {/* Buttons */}
          <div
            className="flex gap-3"
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '15px',
              justifyContent: 'flex-start'
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                borderRadius: '6px',
                backgroundColor: headerColor,
                borderColor: headerColor,
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 16px',
                border: '1.5px solid',
              }}
            >
              {loading ? 'Saving...' : 'Save Plan'}
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={loading}
              style={{
                borderRadius: '6px',
                backgroundColor: '#fff',
                borderColor: cancelBorderColor,
                color: cancelBorderColor,
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 16px',
                border: '1.5px solid',
              }}
            >
              Clear All
            </button>

            <Link
              to="/"
              style={{
                borderRadius: '6px',
                backgroundColor: '#fff',
                borderColor: cancelBorderColor,
                color: cancelBorderColor,
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 16px',
                border: '1.5px solid',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan;
