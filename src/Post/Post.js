import React, {useContext, useState} from 'react';
import './App.css';
import ForArticle from './Article';
import ForQuestion from './Question';
import {Link} from 'react-router-dom';
import { AuthContext } from '../Login/AuthContext';

function Post() {
  // A post funciton that handles which form to post based on the checkbox that is selected. It will render only that component.
    const [status, setStatus] = useState('question')
    const handleChange = (e)=>{
      setStatus(e.target.value)
    }
    
    const {isAuthenticated, isUSP, logout} = useContext(AuthContext);
    if (isUSP && !isAuthenticated) { // If someone left 2FA in between.
      logout();
    }
    return (
      <div class="body">
      <Link to="/FindaQuestion" className='header-link'>Find a Question</Link>  
      <div class="container">
        <div class="banner"><h3>New Post</h3></div><br></br>
        <label for="post">Select Post Type: </label>
        <input type='radio' name='post' id='ques' value={"question"} checked={status === "question"} onChange={handleChange}></input>
        <label for="ques">Question</label>
        <input type='radio' name='post' id='artic' value={"article"} checked={status === "article"} onChange={handleChange}></input>
        <label for="artic">Article</label>
        <div class="banner"><h3>What do you want to ask or share</h3></div>
        {status === "question" ? <ForQuestion/> : <ForArticle/>} 
      </div>
      </div>
    );
  }
  
  export default Post;