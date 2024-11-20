import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import app from './firebase'; // Replace with your Firebase config
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import './forgotpass.css';

const ForgotPassword = () => {
        const auth = getAuth(app);
        const [resetEmail, setResetEmail] = useState(''); // For forgot password
        const navigate = useNavigate();

       // Handle forgot password
       const handleForgotPassword = async () => {
        if (!resetEmail) {
            alert('Please enter your email to reset the password.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert('Password reset email sent! Please check your inbox.');
            setResetEmail(''); // Clear the input
            navigate('/Login')
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div className="forgot-password-section">
            <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword} className="forgot-password-btn">
                Send Reset Email
            </button>
        </div>
    );
}

export default ForgotPassword;