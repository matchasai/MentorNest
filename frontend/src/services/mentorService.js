import api from './api';

export const getAllMentors = async () => {
  try {
    const response = await api.get('/mentors');
    return response.data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    // Return empty array if API fails, so UI doesn't break
    return [];
  }
};

export const getMentorById = async (id) => {
  try {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mentor:', error);
    throw error;
  }
};

export const getMentorCourses = async (mentorId) => {
  try {
    const response = await api.get(`/mentors/${mentorId}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mentor courses:', error);
    throw error;
  }
}; 