import React from 'react';
import { FaCheckCircle, FaClock, FaPlayCircle, FaStar } from 'react-icons/fa';

const ProgressTracker = ({ modules, completedModules, currentModuleIndex, onModuleSelect, className = '' }) => {
  const getModuleStatus = (moduleId) => {
    if (completedModules.includes(moduleId)) {
      return 'completed';
    }
    return 'pending';
  };

  const getProgressPercentage = () => {
    if (!modules || modules.length === 0) return 0;
    return (completedModules.length / modules.length) * 100;
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Progress</h3>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            {Math.round(getProgressPercentage())}%
          </div>
          <div className="text-xs text-gray-500">
            {completedModules.length}/{modules?.length || 0}
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Module List with Progress - Compact and Scrollable */}
      <div className="space-y-2">
        {modules?.map((module, index) => {
          const status = getModuleStatus(module.id);
          const isCurrent = index === currentModuleIndex;
          
          return (
            <div
              key={module.id}
              className={`p-2.5 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                isCurrent 
                  ? 'border-blue-400 bg-blue-50 shadow-sm' 
                  : status === 'completed'
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
              }`}
              onClick={() => onModuleSelect(module, index)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  status === 'completed'
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm leading-tight truncate pr-1">
                    {module.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {status === 'completed' ? (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    ) : isCurrent ? (
                      <span className="text-blue-600 font-medium">▶ In Progress</span>
                    ) : (
                      <span className="text-gray-500">Not Started</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  {status === 'completed' ? (
                    <FaCheckCircle className="text-green-500 text-sm" />
                  ) : isCurrent ? (
                    <FaPlayCircle className="text-blue-500 text-sm" />
                  ) : (
                    <FaClock className="text-gray-400 text-sm" />
                  )}
                </div>
              </div>
              
              {/* Module Progress Indicator - Only for current module */}
              {isCurrent && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Module Progress</span>
                    <span className="text-blue-600 font-medium">25%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievement Badges */}
      {completedModules.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {completedModules.length >= 1 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-full">
                <FaStar className="text-yellow-500 text-sm" />
                <span className="text-xs text-yellow-700">First Module</span>
              </div>
            )}
            {completedModules.length >= Math.ceil((modules?.length || 0) / 2) && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <FaStar className="text-blue-500 text-sm" />
                <span className="text-xs text-blue-700">Halfway There</span>
              </div>
            )}
            {completedModules.length === (modules?.length || 0) && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <FaStar className="text-green-500 text-sm" />
                <span className="text-xs text-green-700">Course Complete</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker; 