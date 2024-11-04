import React, { useEffect, useState, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { fetchUsers, getUserDetails, updateUserDetails } from '../services/userService'; // Import updateUserDetails function
import TaskForm from '../components/TaskForm/TaskForm';
import TaskList from '../components/TaskList/TaskList';
import UserList from '../components/UserList/UserList';
import Modal from '../components/TaskList/Modal'; 
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const Dashboard = () => {
    const { token, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
        } else {
            getUserDetails(token).then(data => setUserDetails(data));
        }
    }, [token, navigate]);

    const openHelpModal = () => {
        setHelpModalOpen(true);
    };

    const closeHelpModal = () => {
        setHelpModalOpen(false);
    };

    const fetchTasks = useCallback(async () => {
        try {
            const data = await getTasks(token);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }, [token]);

    const fetchUserList = useCallback(async () => {
        try {
            const data = await fetchUsers(token);
            if (data.length > 0) {
                setUsers(data);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log('User does not have permission to access user list.');
            } else {
                console.error('Error fetching users:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchTasks();
            fetchUserList();
        }
    }, [token, fetchTasks, fetchUserList]);

    const handleCreateTask = async (taskData) => {
      try {
          // Decode the token to get the user ID
          const decodedToken = jwtDecode(token);
          const userIdFromToken = decodedToken.user_id;
  
          // If an admin has selected a user, use that ID; otherwise, use the ID from the token
          taskData.user = selectedUserId || userIdFromToken; // Ensure the key is `user`, not `user_id`
  
          const newTask = await createTask(taskData);
          setTasks([...tasks, newTask]);
      } catch (error) {
          console.error('Error creating task:', error.response ? error.response.data : error.message);
      }
  };

    const handleUpdateTask = async (taskId, updatedTask) => {
        try {
            const updated = await updateTask(taskId, updatedTask, token);
            setTasks(tasks.map(task => (task.id === taskId ? updated : task)));

            if (updatedTask.completed) {
                let expIncrement = 0;
                if (updatedTask.difficulty === 'Easy') expIncrement = 50;
                else if (updatedTask.difficulty === 'Medium') expIncrement = 75;
                else if (updatedTask.difficulty === 'Hard') expIncrement = 100;

                if (userDetails) {
                    const newExpPoints = userDetails.exp_points + expIncrement;
                    setUserDetails(prev => ({
                        ...prev,
                        exp_points: newExpPoints,
                    }));

                    // Update the exp_points in the backend
                    await updateUserDetails({ ...userDetails, exp_points: newExpPoints }, token);
                }
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId, token);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        logout();
        navigate('/login');
    };

    return (
        <div className="rpgui-content" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="rpgui-container framed" style={{ overflowY: 'auto', maxHeight: '95vh', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div className="rpgui-icon helmet-slot" style={{ marginRight: '10px' }}></div>
                    {userDetails && (
                        <h2 style={{ textAlign: 'center', flex: 1 }}>Welcome, {userDetails.first_name} {userDetails.last_name}</h2>
                    )}
                      {userDetails && <p style={{ margin: 0, marginLeft: '5px' }}>EXP: {userDetails.exp_points}</p>}
                    <div className="rpgui-icon potion-blue" style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                    </div>
                
                </div>
                <button className="rpgui-button " onClick={openHelpModal} style={{ display: 'flex', justifyContent: 'left' }} ><p>Help</p></button>
                <button className="rpgui-button golden" onClick={handleLogout}  ><p>Logout</p></button>
                

                {isHelpModalOpen && (
                    <Modal onClose={closeHelpModal}>
                        <div className="rpgui-container framed">
                        <h3>Task Difficulty Explanation</h3>
                        <p>Easy task: +50 EXP</p>
                        <p>Medium task: +75 EXP</p>
                        <p>Hard task: +100 EXP</p>
                        </div>
                    </Modal>
                )}


                <hr className="golden" />
                {users.length > 0 && (
                    <div>
                        <h2>Create a Task</h2>
                        <UserList users={users} onSelectUser={setSelectedUserId} />
                    </div>
                )}
                <TaskForm onCreateTask={handleCreateTask} />
                <hr className="golden" />
                <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
            </div>
        </div>
    );
};

export default Dashboard;
