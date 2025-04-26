import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CreatePlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    isPublic: true,
    topics: [
      {
        id: 1,
        name: '',
        resourceLink: '',
        targetDate: '',
        status: 'Pending',
      },
    ],
  });

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
    // Here you would typically make an API call to save the plan
    console.log('Form submitted:', formData);
    // Navigate back to home page after successful submission
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Plans
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Learning Plan
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter plan title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter plan description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Make this plan public
                </label>
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Topics
              </h2>
              <button
                type="button"
                onClick={addTopic}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <FaPlus className="mr-2" /> Add Topic
              </button>
            </div>

            <div className="space-y-4">
              {formData.topics.map((topic, index) => (
                <div 
                  key={topic.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-gray-800">
                      Topic {index + 1}
                    </h3>
                    {formData.topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                        title="Remove Topic"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topic Name
                      </label>
                      <input
                        type="text"
                        value={topic.name}
                        onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter topic name"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="https://example.com"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan; 