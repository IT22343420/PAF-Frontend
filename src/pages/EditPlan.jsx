import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EditPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    isPublic: true,
    topics: [],
  });

  useEffect(() => {
    // Here you would typically fetch the plan data from an API
    // For now, we'll use sample data
    const sampleData = {
      title: 'Sample Plan',
      description: 'This is a sample learning plan description.',
      deadline: '2024-12-31',
      isPublic: true,
      topics: [
        {
          id: 1,
          name: 'Topic 1',
          resourceLink: 'https://example.com',
          targetDate: '2024-06-01',
          status: 'Completed',
        },
        {
          id: 2,
          name: 'Topic 2',
          resourceLink: 'https://example.com',
          targetDate: '2024-07-01',
          status: 'Pending',
        },
      ],
    };
    setFormData(sampleData);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
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
          status: 'Pending',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      console.log('Plan deleted');
      navigate('/');
    }
  };

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                style={{ margin: 0 }}
              />
              Public Plan
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ 
              color: '#1f2937',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Topics
            </h2>
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
                  <h3 style={{ color: '#1f2937' }}>Topic {index + 1}</h3>
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
                    color: '#374151'
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
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
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

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '10px', 
            marginTop: '20px' 
          }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Delete Plan
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlan; 