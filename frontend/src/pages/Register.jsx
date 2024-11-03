import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
      });
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Error during registration:', err);
    }
  };

 return (
        <div className="rpgui-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="rpgui-container framed" style={{ width: '400px', padding: '20px' }}>
                <h2 style={{ textAlign: 'center' }}>Register</h2>
                {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
                {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="rpgui-button golden" style={{ width: '100%' }}><p>Register</p></button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>Already have an account? <Link to="/login" style={{ color: '#ffd700' }}>Log in here</Link></p>
            </div>
        </div>
    );
};

export default Register;
