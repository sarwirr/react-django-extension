import React, { useState } from 'react';

const TaskForm = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect the form data into `taskData`
    const taskData = {
      title,
      description,
      difficulty,
      estimated_time: estimatedTime,
    };
    // Pass `taskData` to `onCreateTask`
    onCreateTask(taskData);

    // Clear the form fields after submission
    setTitle('');
    setDescription('');
    setDifficulty('');
    setEstimatedTime('');
  };

  return (
    <div class="rpgui-container framed-grey">
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <select
          class="rpgui-dropdown"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      <input
        type="number"
        placeholder="Estimated Time (hours)"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
        required
      />
      <button class="rpgui-button golden" type="submit"><p>Create Task !</p></button>
    </form>
    </div>
  );
};

export default TaskForm;