import {React, useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import app from './firebase'; // Replace with your Firebase config
import { signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './Login.css';
import { AuthContext } from './AuthContext';

const Login = () => {
    const auth = getAuth(app);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {USPin, USPout, logout, isAuthenticated, isUSP} = useContext(AuthContext);
    // Handle regular email/password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setEmail('');
                setPassword('');
                alert('Login via first-factor successful!');
                USPin();
                navigate('/2fa-setup');
            })
            .catch((error) => {
                alert(error.message);
                setEmail('');
                setPassword('');
                USPout();
            });
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);
            alert('Login via first-factor successful');
            USPin();
            navigate('/2fa-setup');
        } catch (error) {
            alert(error.message);
            USPout();
        }
    };

    // Run once when the component is loaded
    useEffect(() => {
        if (isUSP && !isAuthenticated) {
            logout();
        }
    }, [isUSP, isAuthenticated, logout]); // Dependencies ensure the check runs if `isUSP` or `isAuthenticated` change during moun
    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit}>
                <Link to="/SignUp" className="signup-link">Sign up</Link><br />
                <label htmlFor="email">
                    Email: <br />
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label><br />
                <label htmlFor="password">
                    Password: <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label><br />
                <Link to="/forgot-password">
                    <h5>Forgot Password?</h5>
                </Link>
                <button type="submit">Login</button>
            </form>
            <br />
            <center>
                <button onClick={handleGoogleLogin} className="google-login-btn">
                    Login with Google
                </button>
            </center>
            <br />
        </div>
    );
};

export default Login;
