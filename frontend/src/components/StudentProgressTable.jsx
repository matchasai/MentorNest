import { useEffect, useState } from 'react';
import { FaBook, FaCheckCircle, FaClock, FaDownload, FaUserGraduate } from 'react-icons/fa';
import api from '../services/api';

const StudentProgressTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    loadStudentProgress();
  }, []);

  const loadStudentProgress = async () => {
    try {
      const response = await api.get('/admin/student-progress');
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading student progress:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-400" />;
      case 'in-progress':
        return <FaClock className="text-yellow-400" />;
      case 'not-started':
        return <FaBook className="text-gray-400" />;
      default:
        return <FaBook className="text-gray-400" />;
    }
  };

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    if (filter === 'active') return student.status === 'in-progress';
    if (filter === 'completed') return student.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-blue-200 flex items-center gap-2">
          <FaUserGraduate className="text-green-400" />
          Student Progress Tracking
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              filter === 'active' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              filter === 'completed' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Student</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Course</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Progress</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Modules</th>
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <FaUserGraduate className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{student.name}</div>
                        <div className="text-gray-400 text-xs">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{student.courseTitle}</div>
                    <div className="text-gray-400 text-xs">{student.mentorName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.progress >= 80 ? 'bg-green-500' : 
                            student.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(student.status)}
                      <span className="text-gray-300 capitalize">{student.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">
                      {student.completedModules}/{student.totalModules}
                    </div>
                    <div className="text-gray-400 text-xs">modules completed</div>
                  </td>
                  <td className="py-3 px-4">
                    {student.certificateUrl ? (
                      <button className="flex items-center gap-1 text-green-400 hover:text-green-300">
                        <FaDownload className="text-sm" />
                        <span className="text-xs">Download</span>
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs">Not available</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
        <div>
          Showing {filteredStudents.length} of {students.length} students
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-400" />
            <span>{students.filter(s => s.status === 'completed').length} Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-yellow-400" />
            <span>{students.filter(s => s.status === 'in-progress').length} In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressTable; 