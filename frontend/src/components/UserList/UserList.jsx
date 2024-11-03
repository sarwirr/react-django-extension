// src/components/UserList/UserList.jsx
import React from 'react';

const UserList = ({ users, onSelectUser }) => {
  return (
    <div class="rpgui-container framed-grey" >
      <h3>User List</h3>
      <select class="rpgui-dropdown" onChange={(e) => onSelectUser(e.target.value)}>
        <option value="">Select a user</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserList;
