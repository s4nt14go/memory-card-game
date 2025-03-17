import {useEffect, useRef, useState} from "react";
import backgroundImg from "../assets/images/play.gif";
import buttonHoverSound from "../assets/audio/button-hover.mp3";
import "./Login.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID); // Save the userID
      onLogin();
      navigate('/play');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('User not found. Please register first.');
      } else {
        setError(error.response?.data.message || 'Error logging in');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData); // Add base URL
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.userID); // Save the userID
      onLogin();
      navigate('/play');
    } catch (error) {
      setError(error.response?.data.message || 'Error registering');
    }
  };

  useEffect(() => {
    hoverAudioRef.current = new Audio(buttonHoverSound);
  }, []);
  const hoverAudioRef = useRef(null);
  const playHoverSound = () => {
    hoverAudioRef.current.currentTime = 0;
    hoverAudioRef.current.play().catch((error) =>
      console.error("Hover sound playback failed:", error)
    );
  };

  return (
    <div
      className="background-container"
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
    >
      <h1 className={`game-title`}>
        WonderCards
      </h1>

      <div className="button-container">

        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="text-input"
          placeholder="Username"
          onMouseEnter={playHoverSound}
        />

        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="text-input"
          placeholder="Password"
          onMouseEnter={playHoverSound}
        />

        <div>
          <button
            onClick={handleLogin}
            className={`game-button`}
            onMouseEnter={playHoverSound}
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className={`game-button`}
            onMouseEnter={playHoverSound}
          >
            Register
          </button>
        </div>

        <p className={'error'}>{error}</p>

      </div>
    </div>
  );
};

export default Login;
