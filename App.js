import Home from './Home'
import './App.css'
import Login from './Login/Login';
import Signup from "./Login/Signup";
import Post from './Post/Post';
import SearchBar from './Post/Search';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import app from "./Login/firebase";
import { getAuth, signOut, onAuthStateChanged  } from "firebase/auth";
import {useState, useEffect, useContext} from 'react';
import Plans from './Plan';
import Premium from './Premium';
import AllArticles from './Allarticles';
import ForgotPassword from './Login/forgotpass';
import VideoUpload from './Tutorial/videoupload';
import Tutorial from './Tutorial/tutorial';
import TwoFactorSetup from './Login/2FA/TwoFactorSetup';
import TwoFactorVerify from './Login/2FA/TwoFactorVerify';
import Chatbot from './Chatbot';
import { AuthContext } from './Login/AuthContext';


function App() {
  const {logout} = useContext(AuthContext);
  const [loggedUser, setloggedUser] = useState('');
  const auth = getAuth(app);

  const handleSignOut = async (e) => {
    try {
      await signOut(auth);
      alert("Sign Out was successful.");
      logout(); 
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setloggedUser(user.email);
      } else {
        setloggedUser("");
      }
    });
    // Cleanup the subscription when the component unmounts
    return () => {
      unsubscribe();
    }
  }, [auth]);

  return (
    <div>
    <Router>
      <center>
        
      <nav className="navbar">
            <div className="nav-logo">
                <Link to="/" className="p-link">Dev@Deakin</Link>
            </div>
            <img src='https://www.deakin.edu.au/__data/assets/image/0007/1146985/logo_deakin-rebrand-stacked.png' alt='logo' className='logo-image'></img>
            <div className="nav-links">
                <Link to="/Login" className="s-link">Login</Link>
                <Link to="/Post" className="s-link">Post</Link>
                <Link to="/Plans" className="s-link">Plans</Link>
                <Link to="/tutorials" className="s-link">Tutorials</Link>
                <Link to="/Chatbot" className="s-link">Chatbot</Link>
            </div>
        </nav>
        <br></br>
      </center>
      <h3 style={{textAlign:'center'}}> Welcome ! {loggedUser} {loggedUser ? <button onClick={handleSignOut} className='signout-btn'>Sign Out</button> : null} </h3>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/SignUp" element={<Signup/>}/>
      <Route path="/FindaQuestion" element={<SearchBar/>}/>
      <Route path="/Post" element={<Post/>}/>
      <Route path='/Plans' element={<Plans/>}/>
      <Route path='/Plans/Premium-Checkout' element={<Premium/>}/>
      <Route path='/articles' element={<AllArticles/>}></Route>
      <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
      <Route path='/Video-upload' element={<VideoUpload/>}></Route>
      <Route path='/tutorials' element={<Tutorial/>}></Route>
      <Route path='/2fa-setup' element={<TwoFactorSetup/>}></Route>
      <Route path='/2fa-verify' element={<TwoFactorVerify/>}></Route>
      <Route path='/Chatbot' element={<Chatbot/>}></Route>
    </Routes>
    </Router>
    </div>
  );
}

export default App;
