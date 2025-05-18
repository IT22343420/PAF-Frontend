import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helpers for date formatting
const displayDate = (dateStr) => (dateStr ? dateStr.slice(0, 10) : '');
const toISODate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes('T')) return dateStr;
  return new Date(dateStr).toISOString();
};

// Colors used in styling
const headerColor = '#4c51bf'; // Indigo shade
const labelColor = '#5a67d8'; // Lighter indigo
const errorColor = '#dc2626'; // Red for errors

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

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
          topics:
            data.topics && data.topics.length > 0
              ? data.topics
              : [
                  {
                    id: Date.now(),
                    name: '',
                    resourceLink: '',
                    targetDate: '',
                    status: 'Pending',
                  },
                ],
        });
      } catch {
        setError('Failed to fetch plan.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  // URL validation function
  const isValidUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Validation logic
  const validate = () => {
    const errors = {};
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Reset time to start of day

    if (!formData.planName || formData.planName.trim() === '') {
      errors.planName = 'Title is required.';
    }
    if (!formData.plandesc || formData.plandesc.trim() === '') {
      errors.plandesc = 'Description is required.';
    }
    if (!formData.completedate) {
      errors.completedate = 'Complete Date is required.';
    } else {
      const completeDate = new Date(formData.completedate);
      completeDate.setHours(0, 0, 0, 0);
      if (completeDate < todayDate) {
        errors.completedate = 'Complete Date cannot be before today.';
      }
    }

    // Validate topics array
    if (!formData.topics || formData.topics.length === 0) {
      errors.topics = 'At least one topic is required.';
    } else {
      const topicErrors = formData.topics.map((topic) => {
        const tErr = {};
        if (!topic.name || topic.name.trim() === '') {
          tErr.name = 'Topic Name is required.';
        }
        if (!topic.targetDate) {
          tErr.targetDate = 'Target Date is required.';
        } else {
          const targetDate = new Date(topic.targetDate);
          targetDate.setHours(0, 0, 0, 0);
          if (targetDate < todayDate) {
            tErr.targetDate = 'Target Date cannot be before today.';
          }
        }
        if (topic.resourceLink && !isValidUrl(topic.resourceLink)) {
          tErr.resourceLink = 'Please enter a valid URL (e.g., https://example.com)';
        }
        return tErr;
      });

      // Check if any topic has errors
      const hasTopicErrors = topicErrors.some((t) => Object.keys(t).length > 0);

      if (hasTopicErrors) {
        errors.topicErrors = topicErrors;
      }
    }

    setValidationErrors(errors);
    // Return true if no errors (no keys except possibly topicErrors if empty)
    return Object.keys(errors).length === 0;
  };

  // Handle change on main form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle change on topic fields
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
    setFormData({
      ...formData,
      topics: [
        ...formData.topics,
        {
          id: Date.now(),
          name: '',
          resourceLink: '',
          targetDate: '',
          status: 'Pending',
        },
      ],
    });
  };

  // Remove topic by index
  const removeTopic = (index) => {
    const updatedTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      topics: updatedTopics,
    });
  };

  // Handle form submission for update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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
      setTimeout(() => {
        navigate('/?update=true');
      }, 500);
    } catch (err) {
      setError('Failed to update plan. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData) return <div>Loading...</div>;
  if (error) return <div style={{ color: errorColor, margin: '20px' }}>{error}</div>;
  if (!formData) return <div>Plan not found</div>;

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
          Update My Plan
        </h1>
        <form onSubmit={handleUpdate} noValidate>
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
              className="input-field"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: validationErrors.planName ? `2px solid ${errorColor}` : `1.5px solid ${labelColor}`,
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              placeholder="Enter plan title"
              aria-invalid={validationErrors.planName ? 'true' : 'false'}
            />
            {validationErrors.planName && (
              <p style={{ color: errorColor, marginTop: '6px', fontSize: '14px' }}>{validationErrors.planName}</p>
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
              className="input-field"
              placeholder="Enter plan description"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: validationErrors.plandesc ? `2px solid ${errorColor}` : `1.5px solid ${labelColor}`,
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.3s',
              }}
              aria-invalid={validationErrors.plandesc ? 'true' : 'false'}
            />
            {validationErrors.plandesc && (
              <p style={{ color: errorColor, marginTop: '6px', fontSize: '14px' }}>{validationErrors.plandesc}</p>
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
              className="input-field"
              style={{
                width: '220px',
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: validationErrors.completedate ? `2px solid ${errorColor}` : `1.5px solid ${labelColor}`,
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              aria-invalid={validationErrors.completedate ? 'true' : 'false'}
            />
            {validationErrors.completedate && (
              <p style={{ color: errorColor, marginTop: '6px', fontSize: '14px' }}>{validationErrors.completedate}</p>
            )}
          </div>

          {/* Topics Section */}
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ marginBottom: '15px', fontWeight: '700', color: headerColor, userSelect: 'none', fontSize: '20px' }}>
              Topics <span style={{ color: errorColor }}>*</span>
            </h3>
            {validationErrors.topics && (
              <p style={{ color: errorColor, marginBottom: '10px', fontSize: '14px' }}>{validationErrors.topics}</p>
            )}

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
                      border:
                        validationErrors.topicErrors &&
                        validationErrors.topicErrors[index] &&
                        validationErrors.topicErrors[index].name
                          ? `2px solid ${errorColor}`
                          : `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    aria-invalid={
                      validationErrors.topicErrors &&
                      validationErrors.topicErrors[index] &&
                      validationErrors.topicErrors[index].name
                        ? 'true'
                        : 'false'
                    }
                  />
                  {validationErrors.topicErrors &&
                    validationErrors.topicErrors[index] &&
                    validationErrors.topicErrors[index].name && (
                      <p style={{ color: errorColor, fontSize: '13px', marginTop: '4px' }}>
                        {validationErrors.topicErrors[index].name}
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
                      border:
                        validationErrors.topicErrors &&
                        validationErrors.topicErrors[index] &&
                        validationErrors.topicErrors[index].resourceLink
                          ? `2px solid ${errorColor}`
                          : `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                  />
                  {validationErrors.topicErrors &&
                    validationErrors.topicErrors[index] &&
                    validationErrors.topicErrors[index].resourceLink && (
                      <p style={{ color: errorColor, fontSize: '13px', marginTop: '4px' }}>
                        {validationErrors.topicErrors[index].resourceLink}
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
                    value={topic.targetDate ? topic.targetDate.slice(0, 10) : ''}
                    onChange={(e) => handleTopicChange(index, 'targetDate', e.target.value)}
                    min={today}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '14px',
                      borderRadius: '7px',
                      border:
                        validationErrors.topicErrors &&
                        validationErrors.topicErrors[index] &&
                        validationErrors.topicErrors[index].targetDate
                          ? `2px solid ${errorColor}`
                          : `1.5px solid ${labelColor}`,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    aria-invalid={
                      validationErrors.topicErrors &&
                      validationErrors.topicErrors[index] &&
                      validationErrors.topicErrors[index].targetDate
                        ? 'true'
                        : 'false'
                    }
                  />
                  {validationErrors.topicErrors &&
                    validationErrors.topicErrors[index] &&
                    validationErrors.topicErrors[index].targetDate && (
                      <p style={{ color: errorColor, fontSize: '13px', marginTop: '4px' }}>
                        {validationErrors.topicErrors[index].targetDate}
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
            >
              + Add Topic
            </button>
          </div>

          {/* Submit Button */}
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
              width: '100%',
              cursor: loading ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = loading ? headerColor : '#434190')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = headerColor)}
          >
            {loading ? 'Updating...' : 'Update Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPlan;
