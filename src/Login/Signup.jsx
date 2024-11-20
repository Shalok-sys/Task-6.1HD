import React, { useState } from 'react';
import app from './firebase';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validate password length
        if (password.length <= 6) {
            setErrorMessage('Password must be longer than 6 characters.');
            return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created and logged in successfully!");
            navigate('/');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className='signup-container'>
            <form className='signup-form' onSubmit={handleSubmit}>
                <h2>Create a Dev@Deakin Account</h2>
                <label htmlFor='name'>
                    Name: <br />
                    <input type='text' />
                </label>
                <label htmlFor='email'>
                    Email: <br />
                    <input type='text' onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label htmlFor='password'>
                    Password: <br />
                    <input type='password' onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <br />
                <label htmlFor='confirm-password'>
                    Confirm Password: <br />
                    <input type='password' onChange={(e) => setConfirmPassword(e.target.value)} required />
                </label>
                <br />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type='submit'>Create</button>
            </form>
        </div>
    );
}

export default Signup;
