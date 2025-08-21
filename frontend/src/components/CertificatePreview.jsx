import React, { useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

const CertificatePreview = ({ course, onDownload, onClose, user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await onDownload();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Certificate of Completion
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 mb-6 border-2 border-blue-200">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                Certificate of Completion
              </h2>
              
              <div className="text-lg text-blue-800 mb-6">
                This is to certify that
              </div>
              
              <div className="text-2xl font-bold text-blue-900 mb-4">
                {user?.name || '[Student Name]'}
              </div>
              
              <div className="text-lg text-blue-800 mb-6">
                has successfully completed the course
              </div>
              
              <div className="text-xl font-bold text-blue-900 mb-6">
                {course.title}
              </div>
              
              <div className="text-sm text-blue-700 mb-4">
                Completed on: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="text-xs text-blue-600">
                Certificate ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Course Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>Course:</strong> {course.title}</div>
                <div><strong>Mentor:</strong> {course.mentorName}</div>
                <div><strong>Completion Date:</strong> {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Certificate Features</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  High-quality PNG format
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Professional design
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Unique certificate ID
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Verifiable completion
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <FaDownload />
              {isLoading ? 'Generating...' : 'Download Certificate'}
            </button>
            
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <FaTimes />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview; 