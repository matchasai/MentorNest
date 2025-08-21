import api from "./api";

// Fetch all courses
export async function getCourses() {
  const res = await api.get("/courses");
  return res.data;
}

// Fetch course details by ID
export const getCourseDetails = (id) => api.get(`/courses/${id}`).then(res => res.data);

// This was the source of the /api/api/... bug
export const getModulesForCourse = (courseId) => {
    return api.get(`/student/courses/${courseId}/modules`).then(res => res.data);
};

// Fetch course progress for enrolled student
export const getCourseProgress = (courseId) => {
    return api.get(`/student/courses/${courseId}/progress`).then(res => res.data);
};

// Fetch modules with completion status
export const getModulesWithStatus = (courseId) => {
    return api.get(`/student/courses/${courseId}/modules-with-status`).then(res => res.data);
};

// Mark module as complete
export const markModuleComplete = (courseId, moduleId) => {
    return api.post(`/student/courses/${courseId}/modules/${moduleId}/complete`).then(res => res.data);
};

// Check certificate status
export const getCertificateStatus = (courseId) => {
    return api.get(`/student/courses/${courseId}/certificate`).then(res => res.data);
};

// Download certificate
export const downloadCertificate = (courseId) => {
    return api.get(`/student/courses/${courseId}/certificate/download`, {
        responseType: 'blob'
    });
};

// Enroll in course
export const enrollInCourse = (courseId) => {
    return api.post(`/student/enroll/${courseId}`).then(res => res.data);
};

// Get enrolled courses for current user
export const getEnrolledCourses = () => {
    return api.get("/student/my-courses").then(res => res.data);
}; 