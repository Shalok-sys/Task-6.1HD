import React, { useContext } from 'react';
import VideoList from './videolist';
import { Link } from "react-router-dom";
import { AuthContext } from '../Login/AuthContext';

const Tutorial = () =>{
    const {isUSP, isAuthenticated, logout} = useContext(AuthContext);
    if (isUSP && !isAuthenticated) {
        logout();
      }

    return (
        <div>
            <Link to = "/Video-upload">
            <button>Upload a Video</button>
            </Link>
            <VideoList/>
        </div>
    );
}
export default Tutorial;
