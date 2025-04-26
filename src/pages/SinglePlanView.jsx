import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaLink, FaArrowLeft } from 'react-icons/fa';

const SinglePlanView = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState({
    id: 1,
    title: 'Sample Plan',
    description: 'This is a detailed description of the learning plan. It can be longer than the one shown in the list view.',
    deadline: '2024-12-31',
    isPublic: true,
    topics: [
      {
        id: 1,
        name: 'Topic 1',
        resourceLink: 'https://example.com',
        status: 'Completed',
        targetDate: '2024-06-01',
      },
      {
        id: 2,
        name: 'Topic 2',
        resourceLink: 'https://example.com',
        status: 'Pending',
        targetDate: '2024-07-01',
      },
    ],
  });

  const progress = Math.round(
    (plan.topics.filter(topic => topic.status === 'Completed').length / plan.topics.length) * 100
  );

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

        {/* Plan Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {plan.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Deadline: {new Date(plan.deadline).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/edit/${id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <FaEdit className="mr-2" /> Edit Plan
              </Link>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this plan?')) {
                    // Handle delete
                  }
                }}
              >
                <FaTrash className="mr-2" /> Delete Plan
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {plan.description}
          </p>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-gray-800">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Topics
          </h2>
          <div className="space-y-4">
            {plan.topics.map((topic) => (
              <div 
                key={topic.id} 
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    {topic.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    topic.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {topic.status}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <FaLink className="mr-2 text-blue-600" />
                  <a 
                    href={topic.resourceLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                  >
                    Resource Link
                  </a>
                </div>

                <div className="text-sm text-gray-600">
                  Target Date: {new Date(topic.targetDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlanView; 