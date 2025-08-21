import { FaSync } from 'react-icons/fa';

const RealTimeIndicator = ({ 
  isUpdating = false, 
  lastUpdate = null, 
  autoRefreshInterval = 2,
  onRefresh = null,
  className = "" 
}) => {
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - updateTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    return updateTime.toLocaleTimeString();
  };

  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            isUpdating 
              ? 'bg-blue-500 animate-pulse' 
              : 'bg-green-500'
          }`}></div>
          <span className="text-gray-600">
            {isUpdating ? 'Updating data...' : 'Data is up to date'}
          </span>
        </div>
        
        {/* Last Update Time */}
        {lastUpdate && !isUpdating && (
          <div className="text-gray-500 text-xs">
            Updated {formatLastUpdate(lastUpdate)}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Auto-refresh Info */}
        <div className="text-gray-500 text-xs">
          Auto-refresh every {autoRefreshInterval} minutes
        </div>
        
        {/* Manual Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isUpdating}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <FaSync className={`text-xs ${isUpdating ? 'animate-spin' : ''}`} />
            <span className="text-xs">Refresh</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RealTimeIndicator;
