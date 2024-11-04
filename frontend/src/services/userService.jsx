import httpClient from './httpClient';

export const registerUser = async (userData) => {
  try {
    const response = await httpClient.post('/users/register/', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await httpClient.post('/login/', { username, password });
    const { access } = response.data;

    // Store the access token in localStorage
    localStorage.setItem('jwtToken', access);
    httpClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    console.log('Login successful');
    return access;
  } catch (error) {
    console.error('Error during login:', error);
    alert('Login failed. Please check your credentials and try again.');
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await httpClient.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const updateUserDetails = async (updatedDetails) => {
  try {
      const response = await httpClient.put('/users/update-exp/', updatedDetails);
      return response.data;
  } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
  }
};


export const getUserDetails = async () => {
  try {
      const response = await httpClient.get('/users/me');
      return response.data;
  } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await httpClient.delete(`/users/${userId}/`);
    return 'User deleted successfully';
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};