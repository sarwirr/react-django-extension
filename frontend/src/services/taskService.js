import httpClient from './httpClient';

export const getTasks = async () => {
  try {
    const response = await httpClient.get('/tasks/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
    try {
      console.log(taskData);
      const response = await httpClient.post('/tasks/', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await httpClient.put(`/tasks/${taskId}/`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await httpClient.delete(`/tasks/${taskId}/`);
    return 'Task deleted successfully';
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const getTasksByUserId = async (userId) => {
  try {
    const response = await httpClient.get(`/users/${userId}/tasks/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks for the user:', error);
    throw error;
  }
};