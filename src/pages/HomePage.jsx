import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const HomePage = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      title: 'Sample Plan',
      description: 'This is a sample learning plan description that should be limited to 2-3 lines.',
      progress: 60,
      isPublic: true,
    },
    // Add more sample plans as needed
  ]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Learning Plans
            </h1>
            <p className="text-gray-600">Manage and track your learning progress</p>
          </div>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <span className="mr-2">+</span> Create New Plan
          </Link>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-md"
            >
              {/* Plan Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800 pr-4">
                  {plan.title}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.isPublic ? 'Public' : 'Private'}
                </span>
              </div>

              {/* Plan Description */}
              <p className="text-gray-600 mb-6 line-clamp-2">
                {plan.description}
              </p>
              
              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-800">{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/plan/${plan.id}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                  title="View Plan"
                >
                  <FaEye size={18} />
                </Link>
                <Link
                  to={`/edit/${plan.id}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                  title="Edit Plan"
                >
                  <FaEdit size={18} />
                </Link>
                <button
                  className="text-red-600 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this plan?')) {
                      // Handle delete
                    }
                  }}
                  title="Delete Plan"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📚</span>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Learning Plans Yet</h3>
            <p className="text-gray-600 mb-6">Create your first learning plan to get started</p>
            <Link
              to="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <span className="mr-2">+</span> Create Your First Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 