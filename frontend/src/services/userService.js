import api from "./api";

// Fetch user profile
export async function getProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

// Fetch enrolled courses
export async function getMyCourses() {
  const res = await api.get("/student/my-courses");
  return res.data;
}

// Fetch current user profile (any role)
export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

// Fetch user progress for all enrolled courses
export async function getMyProgress() {
  try {
    const courses = await getMyCourses();
    const progressData = {};
    
    await Promise.all(
      courses.map(async (course) => {
        try {
          const progressRes = await api.get(`/student/courses/${course.id}/progress`);
          progressData[course.id] = Math.min(Math.max(progressRes.data, 0), 1);
        } catch (error) {
          console.error(`Error loading progress for course ${course.id}:`, error);
          progressData[course.id] = 0;
        }
      })
    );
    
    return progressData;
  } catch (error) {
    console.error("Error loading user progress:", error);
    return {};
  }
}

// Fetch user statistics
export async function getUserStats() {
  try {
    const courses = await getMyCourses();
    const progress = await getMyProgress();
    
    const completedCourses = Object.values(progress).filter(p => p >= 1).length;
    const totalProgress = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const averageProgress = courses.length > 0 ? totalProgress / courses.length : 0;
    
    // Check certificates
    const certificatePromises = courses.map(async (course) => {
      if (progress[course.id] >= 1) {
        try {
          await api.get(`/student/courses/${course.id}/certificate`);
          return 1;
        } catch (error) {
          return 0;
        }
      }
      return 0;
    });
    
    const certificates = await Promise.all(certificatePromises);
    const totalCertificates = certificates.reduce((sum, cert) => sum + cert, 0);
    
    return {
      totalCourses: courses.length,
      completedCourses,
      averageProgress: Math.round(averageProgress * 100),
      totalCertificates,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error("Error loading user stats:", error);
    return {
      totalCourses: 0,
      completedCourses: 0,
      averageProgress: 0,
      totalCertificates: 0,
      lastUpdated: Date.now()
    };
  }
}

// Update user profile
export async function updateProfile(data) {
  const res = await api.put("/auth/profile", data);
  return res.data;
} 