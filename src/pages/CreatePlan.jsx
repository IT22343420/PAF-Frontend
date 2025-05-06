import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CreatePlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    planName: '',
    plandesc: '',
    completedate: '',
    topic: '',
    resourceLink: '',
    status: false,
    targetdate: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
          <h1 style={{ marginTop: '10px' }}>
            {id ? 'Edit Learning Plan' : 'Create New Learning Plan'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="plandesc"
              value={formData.plandesc}
              onChange={handleInputChange}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Complete Date</label>
            <input
              type="date"
              name="completedate"
              value={formData.completedate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Resource Link</label>
            <input
              type="url"
              name="resourceLink"
              value={formData.resourceLink}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Target Date</label>
            <input
              type="date"
              name="targetdate"
              value={formData.targetdate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleInputChange}
              style={{ marginRight: '8px' }}
            />
            <label>Status</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            {id && (
              <button type="button" className="btn btn-danger">
                Delete Plan
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn"
              style={{ border: '1px solid #d1d5db' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {id ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan; 