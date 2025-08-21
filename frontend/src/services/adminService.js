import api from "./api";

// Users
export async function getUsers() {
  const res = await api.get("/admin/users");
  return res.data;
}
export async function createUser(data) {
  const res = await api.post("/admin/users", data);
  return res.data;
}
export async function updateUser(id, data) {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data;
}
export async function deleteUser(id) {
  await api.delete(`/admin/users/${id}`);
}
export async function deactivateUser(id) {
  await api.put(`/admin/users/${id}/deactivate`);
}
export async function reactivateUser(id) {
  await api.put(`/admin/users/${id}/reactivate`);
}
export async function resetUserPassword(id, newPassword) {
  const res = await api.post(`/admin/users/${id}/reset-password`, null, { params: { newPassword } });
  return res.data;
}

// Mentor service
export const getMentors = () => api.get("/admin/mentors").then(res => res.data);

export const createMentor = (formData) => {
    return api.post("/admin/mentors", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(res => res.data);
};

export const updateMentor = (id, formData) => {
    return api.put(`/admin/mentors/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then(res => res.data);
};

export const deleteMentor = (id) => api.delete(`/admin/mentors/${id}`);

// Course service
export const getAdminCourses = () => api.get("/admin/courses").then(res => res.data);
export const createCourse = (data) => api.post("/admin/courses", data).then(res => res.data);
export const updateCourse = (id, data) => api.put(`/admin/courses/${id}`, data).then(res => res.data);
export const deleteCourse = (id) => api.delete(`/admin/courses/${id}`);
export const assignMentor = (courseId, mentorId) => api.post(`/admin/courses/${courseId}/mentor/${mentorId}`);

// Module service
export const createModule = (courseId, data) => api.post(`/admin/courses/${courseId}/modules`, data).then(res => res.data);
export const updateModule = (moduleId, data) => api.put(`/admin/modules/${moduleId}`, data).then(res => res.data);
export const deleteModule = (moduleId) => api.delete(`/admin/modules/${moduleId}`); 