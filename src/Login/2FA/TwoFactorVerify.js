import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './TwoFactorVerify.css';  // Make sure to import the CSS file

const TwoFactorVerify = () => {
  const [token, setToken] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isUSP,isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUSP && !isAuthenticated) { // If someone enters through URL
      logout();
      navigate('/Login');
    }

    const timer = setTimeout(() => {
      alert('2FA not completed. Logging out...');
      logout();
      navigate('/Login');
    }, 300000); // 5 minutes

    return () => clearTimeout(timer);
  }, [isAuthenticated, logout, navigate, isUSP]);


  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {  // Ensure only numbers are entered
      const newToken = [...token];
      newToken[index] = value;
      setToken(newToken);

      // Automatically move focus to the next input field
      if (value && index < 5) {
        e.target.nextElementSibling.focus();
      }
    }
  };



  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      e.target.previousElementSibling.focus();
    }
  };

  const verifyToken = async () => {
    const enteredToken = token.join('');
    if (!enteredToken) {
      setError('Token cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/verify-2fa', { token: enteredToken });
      if (response.data.success) {
        login();
        navigate('/');
      } else {
        setError('Invalid token. Please try again.');
        logout();
        navigate('/Login');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while verifying the token. Please try again later.');
      logout();
      navigate('/Login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='outer'>
    <div className="verify-2fa">
      <h1>Verify Two-Factor Authentication</h1>
      <div className="otp-inputs">
        {token.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
            className="otp-input"
          />
        ))}
      </div>
      <button onClick={verifyToken} disabled={loading} className="verify-button">
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
    </div>
  );
};

export default TwoFactorVerify;
