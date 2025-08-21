import api from './api';
import { getMyCourses } from './userService';

// Real-time data service for fetching updated course and progress information
export class RealTimeService {
  constructor() {
    this.subscriptions = new Set();
    this.lastFetch = {};
    this.cache = {};
  }

  // Subscribe to real-time updates
  subscribe(callback, type = 'all') {
    const subscription = { callback, type, id: Date.now() };
    this.subscriptions.add(subscription);
    return subscription.id;
  }

  // Unsubscribe from updates
  unsubscribe(subscriptionId) {
    for (const sub of this.subscriptions) {
      if (sub.id === subscriptionId) {
        this.subscriptions.delete(sub);
        break;
      }
    }
  }

  // Notify all subscribers
  notify(data, type = 'all') {
    this.subscriptions.forEach(sub => {
      if (sub.type === 'all' || sub.type === type) {
        sub.callback(data, type);
      }
    });
  }

  // Fetch fresh course data
  async fetchCourseData(courseId, forceRefresh = false) {
    const cacheKey = `course_${courseId}`;
    const now = Date.now();
    
    // Return cached data if it's fresh (less than 5 minutes old)
    if (!forceRefresh && this.cache[cacheKey] && (now - this.lastFetch[cacheKey]) < 300000) {
      return this.cache[cacheKey];
    }

    try {
      const [progressRes, moduleRes] = await Promise.all([
        api.get(`/student/courses/${courseId}/progress`),
        api.get(`/student/courses/${courseId}/modules-with-status`)
      ]);

      const courseData = {
        courseId,
        progress: Math.min(Math.max(progressRes.data, 0), 1),
        modules: moduleRes.data.modules || [],
        completedModules: moduleRes.data.completedModules || [],
        certificateUrl: moduleRes.data.certificateUrl || null,
        lastUpdated: now
      };

      this.cache[cacheKey] = courseData;
      this.lastFetch[cacheKey] = now;
      
      this.notify(courseData, 'course');
      return courseData;
    } catch (error) {
      console.error(`Failed to fetch course data for ${courseId}:`, error);
      return null;
    }
  }

  // Fetch all enrolled courses with fresh data
  async fetchAllCoursesData(forceRefresh = false) {
    try {
      const courses = await getMyCourses();
      const courseDataPromises = courses.map(course => 
        this.fetchCourseData(course.id, forceRefresh)
      );
      
      const coursesData = await Promise.all(courseDataPromises);
      const validCoursesData = coursesData.filter(data => data !== null);
      
      this.notify(validCoursesData, 'courses');
      return validCoursesData;
    } catch (error) {
      console.error('Failed to fetch all courses data:', error);
      return [];
    }
  }

  // Check for certificate updates
  async checkCertificateStatus(courseId) {
    try {
      const response = await api.get(`/student/courses/${courseId}/certificate`);
      const certificateData = {
        courseId,
        certificateUrl: response.data,
        lastChecked: Date.now()
      };
      
      this.notify(certificateData, 'certificate');
      return certificateData;
    } catch (error) {
      return { courseId, certificateUrl: null, error: error.response?.data };
    }
  }

  // Start periodic updates
  startPeriodicUpdates(interval = 120000) { // 2 minutes
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(() => {
      this.fetchAllCoursesData(false);
    }, interval);
  }

  // Stop periodic updates
  stopPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Clear cache
  clearCache() {
    this.cache = {};
    this.lastFetch = {};
  }
}

// Singleton instance
export const realTimeService = new RealTimeService();

// Hook for React components
export const useRealTimeData = (type = 'all') => {
  const [data, setData] = React.useState(null);
  const [lastUpdate, setLastUpdate] = React.useState(Date.now());

  React.useEffect(() => {
    const subscriptionId = realTimeService.subscribe((newData, dataType) => {
      setData(newData);
      setLastUpdate(Date.now());
    }, type);

    return () => {
      realTimeService.unsubscribe(subscriptionId);
    };
  }, [type]);

  return { data, lastUpdate };
};

export default realTimeService;
