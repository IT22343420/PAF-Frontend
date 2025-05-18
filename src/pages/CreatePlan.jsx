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
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  // Convert date to ISO string for backend
  const toISODate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('T')) return dateStr;
    return new Date(dateStr).toISOString();
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

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
    setError({});
  };

  // Validate form before submit
  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    if (!formData.planName.trim()) errors.planName = 'Title is required.';
    if (!formData.plandesc.trim()) errors.plandesc = 'Description is required.';
    
    // Validate complete date
    if (!formData.completedate) {
      errors.completedate = 'Complete Date is required.';
    } else {
      const completeDate = new Date(formData.completedate);
      completeDate.setHours(0, 0, 0, 0);
      if (completeDate < today) {
        errors.completedate = 'Complete Date cannot be before today.';
      }
    }

    // Validate topics
    for (let i = 0; i < formData.topics.length; i++) {
      const topic = formData.topics[i];
      if (!topic.name.trim()) errors[`topic-${i}-name`] = `Topic ${i + 1}: Name is required.`;
      
      // Validate target date
      if (!topic.targetDate) {
        errors[`topic-${i}-targetDate`] = `Topic ${i + 1}: Target Date is required.`;
      } else {
        const targetDate = new Date(topic.targetDate);
        targetDate.setHours(0, 0, 0, 0);
        if (targetDate < today) {
          errors[`topic-${i}-targetDate`] = `Topic ${i + 1}: Target Date cannot be before today.`;
        }
      }

      // Validate resource link if provided
      if (topic.resourceLink && !isValidUrl(topic.resourceLink)) {
        errors[`topic-${i}-resourceLink`] = `Topic ${i + 1}: Please enter a valid URL (e.g., https://example.com)`;
      }
    }
    
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // URL validation function
  const isValidUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

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
      setTimeout(() => {
        navigate('/?create=true');
      }, 500);
    } catch (err) {
      setError('Failed to create plan. Please try again later.');
      toast.error('Failed to create plan. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Colors (same as before)
  const headerColor = '#4c51bf'; // Indigo shade
  const labelColor = '#5a67d8'; // Lighter indigo
  const errorColor = '#dc2626'; // Red for errors

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0px auto',
        padding: '10px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9fafb',
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: headerColor,
          textDecoration: 'none',
          marginBottom: '25px',
          fontWeight: '600',
          fontSize: '16px',
          gap: '6px',
        }}
      >
        <FaArrowLeft />
        Back to Home
      </Link>
      <div
        style={{
          background: 'white',
          padding: '30px 25px',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${labelColor}30`,
        }}
      >
        <h1
          style={{
            fontSize: '30px',
            fontWeight: '700',
            color: headerColor,
            marginBottom: '25px',
            userSelect: 'none',
          }}
        >
          New Learning Plan
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={{ marginBottom: '22px' }}>
            <label
              htmlFor="planName"
              style={{
                display: 'block',
                marginBottom: '7px',
                fontWeight: '600',
                color: labelColor,
                userSelect: 'none',
              }}
            >
              Title <span style={{ color: errorColor }}>*</span>
            </label>
            <input
              type="text"
              id="planName"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: `1.5px solid ${labelColor}`,
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              placeholder="Enter plan title"
              aria-required="true"
              aria-invalid={formData.planName.trim() === '' ? 'true' : 'false'}
              disabled={loading}
            />
            {error.planName && (
              <p style={{ color: errorColor, marginTop: '6px', fontSize: '14px' }}>{error.planName}</p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '22px' }}>
            <label
              htmlFor="plandesc"
              style={{
                display: 'block',
                marginBottom: '7px',
                fontWeight: '600',
                color: labelColor,
                userSelect: 'none',
              }}
            >
              Description <span style={{ color: errorColor }}>*</span>
            </label>
            <textarea
              id="plandesc"
              name="plandesc"
              value={formData.plandesc}
              onChange={handleInputChange}
              rows="4"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: `1.5px solid ${labelColor}`,
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.3s',
              }}
              placeholder="Enter plan description"
              aria-required="true"
              aria-invalid={formData.plandesc.trim() === '' ? 'true' : 'false'}
              disabled={loading}
            />
            {error.plandesc && (
              <p style={{ color: errorColor, marginTop: '6px', fontSize: '14px' }}>{error.plandesc}</p>
            )}
          </div>

          {/* Complete Date */}
          <div style={{ marginBottom: '22px' }}>
            <label
              htmlFor="completedate"
              style={{
                display: 'block',
                marginBottom: '7px',
                fontWeight: '600',
                color: labelColor,
                userSelect: 'none',
              }}
            >
              Complete Date <span style={{ color: errorColor }}>*</span>
            </label>
            <input
              type="date"
              id="completedate"
              name="completedate"
              value={formData.completedate || ''}
              onChange={handleInputChange}
              min={today}
              style={{
                width: '220px',
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: `1.5px solid ${labelColor}`,
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              aria-required="true"
              aria-invalid={formData.completedate === '' ? 'true' : 'false'}
              disabled={loading}
            />
            {error.completedate && (
              <p style={{ color: errorColor, marginTop: '6px', fontSize: '14px' }}>{error.completedate}</p>
            )}
          </div>

          {/* Topics Section */}
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ marginBottom: '15px', fontWeight: '700', color: headerColor, userSelect: 'none', fontSize: '20px' }}>
              Topics <span style={{ color: errorColor }}>*</span>
            </h3>
            {formData.topics.map((topic, index) => (
              <div
                key={topic.id}
                style={{
                  marginBottom: '15px',
                  padding: '15px',
                  borderRadius: '10px',
                  background: '#f9fafb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: `1px solid ${labelColor}88`,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '14px',
                  alignItems: 'center',
                }}
              >
                {/* Topic Name */}
                <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <label
                    htmlFor={`topic-name-${topic.id}`}
                    style={{ display: 'block', fontWeight: '600', color: labelColor, marginBottom: '5px' }}
                  >
                    Topic Name <span style={{ color: errorColor }}>*</span>
                  </label>
                  <input
                    id={`topic-name-${topic.id}`}
                    type="text"
                    value={topic.name}
                    onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                    placeholder="Topic name"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '14px',
                      borderRadius: '7px',
                      border: `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    aria-required="true"
                    aria-invalid={topic.name.trim() === '' ? 'true' : 'false'}
                    disabled={loading}
                  />
                  {error[`topic-${index}-name`] && (
                    <p style={{ color: errorColor, fontSize: '13px', marginTop: '4px' }}>
                      {error[`topic-${index}-name`]}
                    </p>
                  )}
                </div>

                {/* Resource Link */}
                <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <label
                    htmlFor={`topic-link-${topic.id}`}
                    style={{ display: 'block', fontWeight: '600', color: labelColor, marginBottom: '5px' }}
                  >
                    Resource Link
                  </label>
                  <input
                    id={`topic-link-${topic.id}`}
                    type="url"
                    value={topic.resourceLink}
                    onChange={(e) => handleTopicChange(index, 'resourceLink', e.target.value)}
                    placeholder="https://example.com"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '14px',
                      borderRadius: '7px',
                      border: `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    disabled={loading}
                  />
                  {error[`topic-${index}-resourceLink`] && (
                    <p style={{ color: errorColor, fontSize: '13px', marginTop: '4px' }}>
                      {error[`topic-${index}-resourceLink`]}
                    </p>
                  )}
                </div>

                {/* Target Date */}
                <div style={{ flex: '1 1 180px', minWidth: '180px' }}>
                  <label
                    htmlFor={`topic-targetDate-${topic.id}`}
                    style={{ display: 'block', fontWeight: '600', color: labelColor, marginBottom: '5px' }}
                  >
                    Target Date <span style={{ color: errorColor }}>*</span>
                  </label>
                  <input
                    id={`topic-targetDate-${topic.id}`}
                    type="date"
                    value={topic.targetDate}
                    onChange={(e) => handleTopicChange(index, 'targetDate', e.target.value)}
                    min={today}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '14px',
                      borderRadius: '7px',
                      border: `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    aria-required="true"
                    aria-invalid={topic.targetDate === '' ? 'true' : 'false'}
                    disabled={loading}
                  />
                  {error[`topic-${index}-targetDate`] && (
                    <p style={{ color: errorColor, fontSize: '13px', marginTop: '4px' }}>
                      {error[`topic-${index}-targetDate`]}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div style={{ flex: '1 1 140px', minWidth: '140px' }}>
                  <label
                    htmlFor={`topic-status-${topic.id}`}
                    style={{ display: 'block', fontWeight: '600', color: labelColor, marginBottom: '5px' }}
                  >
                    Status
                  </label>
                  <select
                    id={`topic-status-${topic.id}`}
                    value={topic.status}
                    onChange={(e) => handleTopicChange(index, 'status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '14px',
                      borderRadius: '7px',
                      border: `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      cursor: 'pointer',
                      backgroundColor: 'white',
                    }}
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Remove Topic Button */}
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  title="Remove Topic"
                  style={{
                    marginLeft: '10px',
                    backgroundColor: '#e53e3e',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  aria-label={`Remove topic ${topic.name || index + 1}`}
                  disabled={loading}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {/* Add Topic Button */}
            <button
              type="button"
              onClick={addTopic}
              style={{
                marginTop: '10px',
                padding: '10px 15px',
                backgroundColor: headerColor,
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#434190')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = headerColor)}
              disabled={loading}
            >
              + Add Topic
            </button>
          </div>

          {/* Submit, Clear All, and Cancel Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px 20px',
                fontSize: '18px',
                fontWeight: '700',
                backgroundColor: headerColor,
                color: 'white',
                borderRadius: '10px',
                border: 'none',
                minWidth: '150px',
                cursor: loading ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = loading ? headerColor : '#434190')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = headerColor)}
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={loading}
              style={{
                padding: '13px 20px',
                fontSize: '18px',
                fontWeight: '700',
                backgroundColor: '#fff',
                color: headerColor,
                borderRadius: '10px',
                border: `2px solid ${headerColor}`,
                minWidth: '150px',
                cursor: loading ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#3730a3';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = headerColor;
              }}
            >
              Clear All
            </button>
            <Link
              to="/"
              style={{
                padding: '13px 20px',
                fontSize: '18px',
                fontWeight: '700',
                backgroundColor: '#fff',
                color: headerColor,
                borderRadius: '10px',
                border: `2px solid ${headerColor}`,
                minWidth: '150px',
                cursor: loading ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s, color 0.3s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#3730a3';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = headerColor;
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
