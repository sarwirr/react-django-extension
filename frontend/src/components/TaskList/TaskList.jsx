import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        // Ensure RPGUI initializes checkboxes after rendering
        if (window.RPGUI) {
            const checkboxes = document.querySelectorAll('.rpgui-checkbox');
            checkboxes.forEach((checkbox) => window.RPGUI.create(checkbox, 'checkbox'));
        }
    }, [tasks]);

    const handleOpenEditModal = (task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setSelectedTask(null);
        setIsDeleteModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleDeleteConfirmation = () => {
        if (selectedTask) {
            onDeleteTask(selectedTask.id);
            handleCloseModals();
        }
    };

    const handleUpdate = (updatedTask) => {
        if (selectedTask) {
            onUpdateTask(selectedTask.id, updatedTask);
            handleCloseModals();
        }
    };

    const toggleTaskCompletion = (task) => {
        const updatedTask = { ...task, completed: !task.completed };
        onUpdateTask(task.id, updatedTask);
    };

    return (
        <div
          className="rpgui-container rpgui-center framed-grey"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <ul style={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0, gap: '20px', justifyContent: 'center', width: '100%', maxWidth: '1200px' }}>
            {tasks.filter(task => !task.completed).map((task) => (
              <li key={task.id} style={{ border: '1px solid #ccc', padding: '10px', minWidth: '200px', flex: '1 1 300px' }}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p>Difficulty: {task.difficulty}</p>
                <p>Estimated Time: {task.estimated_time} hours</p>
                <div>
                  <input
                    className="rpgui-checkbox"
                    type="checkbox"
                    id={`task-completed-${task.id}`}
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                  <label htmlFor={`task-completed-${task.id}`}>Mark as Completed</label>
                </div>
                <button className="rpgui-button" onClick={() => handleOpenEditModal(task)}>
                  <p>Edit</p>
                </button>
                <button className="rpgui-button" onClick={() => handleOpenDeleteModal(task)}>
                  <p>Delete</p>
                </button>
              </li>
            ))}
          </ul>

          {isEditModalOpen && selectedTask && (
            <Modal onClose={handleCloseModals}>
              <h2>Edit Task</h2>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  const updatedTask = {
                      ...selectedTask,
                      // Collect updated values here
                  };
                  handleUpdate(updatedTask);
              }}>
                <input
                  type="text"
                  defaultValue={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  required
                />
                <textarea
                  defaultValue={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  required
                ></textarea>
                <button type="submit" className="rpgui-button">Save</button>
              </form>
            </Modal>
          )}

          {isDeleteModalOpen && selectedTask && (
            <Modal onClose={handleCloseModals}>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete the task titled "{selectedTask.title}"?</p>
              <button className="rpgui-button" onClick={handleDeleteConfirmation}>Yes, Delete</button>
              <button className="rpgui-button" onClick={handleCloseModals}>Cancel</button>
            </Modal>
          )}
        </div>
      );
};

export default TaskList;
