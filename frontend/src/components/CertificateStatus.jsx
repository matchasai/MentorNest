import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCertificate, FaClock, FaDownload, FaExclamationTriangle, FaSpinner, FaSync } from 'react-icons/fa';
import api from '../services/api';

const CertificateStatus = ({ courseId, courseTitle, progress, onRefresh }) => {
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const loadCertificate = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/student/courses/${courseId}/certificate`);
      setCertificateUrl(response.data);
      setLastRefresh(Date.now());
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data || 'Certificate not available yet');
      } else {
        setError('Failed to load certificate');
      }
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (progress >= 1) {
      loadCertificate();
    }
  }, [progress, courseId, loadCertificate]);

  // Auto-refresh certificate status every 30 seconds for completed courses
  useEffect(() => {
    if (progress >= 1 && !certificateUrl) {
      const interval = setInterval(() => {
        loadCertificate(false);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [progress, certificateUrl, loadCertificate]);

  const handleDownloadCertificate = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/student/courses/${courseId}/certificate/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${courseTitle.replace(/[^a-zA-Z0-9]/g, '-')}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Certificate download error:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data || "Course not completed. Please complete all modules first.");
      } else {
        toast.error("Failed to download certificate. Please try again.");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleRefreshCertificate = () => {
    loadCertificate(true);
    if (onRefresh) onRefresh();
  };

  const getStatusIcon = () => {
    if (loading) return <FaSpinner className="animate-spin text-blue-500" />;
    if (certificateUrl) return <FaCertificate className="text-green-500" />;
    if (error) return <FaExclamationTriangle className="text-red-500" />;
    return <FaClock className="text-gray-400" />;
  };

  const getStatusText = () => {
    if (loading) return 'Generating certificate...';
    if (certificateUrl) return 'Certificate ready';
    if (error) return error;
    if (progress >= 1) return 'Certificate generating...';
    return 'Complete course to earn certificate';
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (certificateUrl) return 'text-green-600';
    if (error) return 'text-red-600';
    return 'text-gray-500';
  };

  const getActionButton = () => {
    if (loading) {
      return (
        <button disabled className="inline-flex items-center space-x-2 bg-gray-100 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
          <FaSpinner className="animate-spin" />
          <span>Generating...</span>
        </button>
      );
    }

    if (certificateUrl) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadCertificate}
            disabled={downloading}
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            <span>{downloading ? 'Downloading...' : 'Download'}</span>
          </button>
          <button
            onClick={handleRefreshCertificate}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="Refresh certificate status"
          >
            <FaSync className="text-sm" />
          </button>
        </div>
      );
    }

    if (progress >= 1 && !certificateUrl && !error) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => loadCertificate(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaCertificate />
            <span>Generate Certificate</span>
          </button>
          <button
            onClick={handleRefreshCertificate}
            className="inline-flex items-center space-x-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            title="Refresh status"
          >
            <FaSync className="text-sm" />
          </button>
        </div>
      );
    }

    if (error) {
      return (
        <button
          onClick={handleRefreshCertificate}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          title="Retry"
        >
          <FaSync className="text-sm" />
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {progress >= 1 && !certificateUrl && !error && (
            <p className="text-xs text-gray-500 mt-1">
              Click "Generate Certificate" to create your certificate
            </p>
          )}
          {lastRefresh && certificateUrl && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {new Date(lastRefresh).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      {getActionButton()}
    </div>
  );
};

export default CertificateStatus; 