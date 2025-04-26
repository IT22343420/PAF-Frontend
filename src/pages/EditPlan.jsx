import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';

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
          id: formData.topics.length + 1,
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
    // Here you would typically make an API call to update the plan
    console.log('Form submitted:', formData);
    // Navigate back to the plan view after successful update
    navigate(`/plan/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      // Here you would typically make an API call to delete the plan
      console.log('Plan deleted:', id);
      // Navigate back to home page after successful deletion
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
          Edit Learning Plan
        </h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Delete Plan
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 transform hover:shadow-xl transition-all duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
            />
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
            />
            <label className="ml-2 block text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Make this plan public
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 transform hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Topics
            </h2>
            <button
              type="button"
              onClick={addTopic}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="mr-2" /> Add Topic
            </button>
          </div>

          {formData.topics.map((topic, index) => (
            <div 
              key={topic.id} 
              className="border rounded-lg p-4 space-y-4 mb-4 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-md hover:border-blue-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">Topic {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-all duration-200"
                >
                  <FaTrash />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={topic.name}
                  onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Link (optional)
                </label>
                <input
                  type="url"
                  value={topic.resourceLink}
                  onChange={(e) => handleTopicChange(index, 'resourceLink', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={topic.targetDate}
                  onChange={(e) => handleTopicChange(index, 'targetDate', e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={topic.status}
                  onChange={(e) => handleTopicChange(index, 'status', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/plan/${id}`)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Update Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlan; 