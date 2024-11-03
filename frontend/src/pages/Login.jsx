import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/dashboard'); // Redirect to dashboard or desired page after login
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="rpgui-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="rpgui-container framed" style={{ width: '400px' }}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="rpgui-button golden" type="submit"><p>Login</p></button>
                </form>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
    
};

export default Login;
