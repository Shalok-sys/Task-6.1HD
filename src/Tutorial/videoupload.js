import React, { useState} from 'react';
import app from '../Login/firebase'; // Replace with your Firebase config
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, push } from 'firebase/database';
import './videoupload.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const VideoUpload = () => {
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const navigate = useNavigate();

    const handleUpload = () => {
        if (!video || !title) {
            alert('Please provide a video and title.');
            return;
        }

        const storage = getStorage(app);
        const db = getDatabase(app);

        const videoRef = ref(storage, `videos/${Date.now()}-${video.name}`);
        const uploadTask = uploadBytesResumable(videoRef, video);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadStatus(`Upload is ${progress.toFixed(0)}% done`);
            },
            (error) => {
                alert('Video upload failed!');
                console.error(error);
            },
            async () => {
                const videoURL = await getDownloadURL(uploadTask.snapshot.ref);

                const videoMetadata = {
                    title: title,
                    url: videoURL,
                    views: 0,
                    rating: 0
                };

                // Push metadata to Realtime Database
                const videoListRef = dbRef(db, 'videos');
                await push(videoListRef, videoMetadata);

                setUploadStatus('Upload complete!');
                setTitle('');
                setVideo(null);
                navigate('/tutorials');
            }
        );
    };

    return (
        <div>
        <center>
        <div className="upload-container">
            <h2>Upload Video</h2>
            <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            <p className="upload-status">{uploadStatus}</p>
        </div>
        </center>
        </div>
    );
};

export default VideoUpload;
