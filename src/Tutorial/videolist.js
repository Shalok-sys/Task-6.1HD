import React, { useEffect, useState, useContext } from 'react';
import app from '../Login/firebase'; // Replace with your Firebase config
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import './videolist.css'; // Import the CSS file
import { AuthContext } from '../Login/AuthContext';

const VideoList = () => {
    const { isUSP, isAuthenticated, logout } = useContext(AuthContext);

    if (isUSP && !isAuthenticated) {
        logout();
    }

    const [videos, setVideos] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState({}); // Track ratings for each video

    useEffect(() => {
        const db = getDatabase(app);
        const videoListRef = dbRef(db, 'videos');

        const unsubscribe = onValue(videoListRef, (snapshot) => {
            const data = snapshot.val();
            const videoArray = data
                ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
                : [];
            setVideos(videoArray);
        });

        return () => unsubscribe();
    }, []);

    const incrementViews = (videoId, currentViews) => {
        const db = getDatabase(app);
        const videoRef = dbRef(db, `videos/${videoId}`);
        update(videoRef, { views: currentViews + 1 });
    };

    const rateVideo = (videoId, currentRating, reviewCount) => {
            const selectedRating = selectedRatings[videoId];
            if (!selectedRating) {
                alert('Please select a rating before submitting.');
                return;
            }
    
            const db = getDatabase(app);
            const videoRef = dbRef(db, `videos/${videoId}`);
    
            // Calculate new total rating and review count
            const newTotalRating = currentRating + selectedRating;
            const newReviewCount = reviewCount + 1;
    
            // Calculate the new average rating
            const newAverageRating = newTotalRating / newReviewCount;
    
            // Update Firebase with new values: total rating, review count, and average rating
            update(videoRef, {
                rating: newAverageRating,
                totalRating: newTotalRating,
                reviewCount: newReviewCount,
            });
    
            alert('Thank you for your rating!');
            // Clear the rating for this video after submission
            setSelectedRatings((prev) => ({ ...prev, [videoId]: null }));
    };

    const handleStarClick = (videoId, rating) => {
        setSelectedRatings((prev) => ({ ...prev, [videoId]: rating }));
    };

    return (
        <div>
        <h2>Uploaded Videos</h2>
        <div className="video-list-container">
            {videos.map((video) => (
                <div key={video.id} className="video-card">
                    <h3>{video.title}</h3>
                    <video
                        controls
                        onPlay={() => incrementViews(video.id, video.views)}
                    >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <p>👁️‍🗨️ Views: {video.views}</p>
                    <p>🌟 Rating: {video.rating}</p>

                    {/* Star rating UI */}
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <span
                                key={rating}
                                className={`star ${
                                    selectedRatings[video.id] >= rating ? 'selected' : ''
                                }`}
                                onClick={() => handleStarClick(video.id, rating)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {isAuthenticated ? (
                    <button className="submit-btn" onClick={() => rateVideo(video.id, video.totalRating || 0, video.reviewCount || 0)}>
                        Submit Rating
                    </button>
                    ) : (
                    <p className="auth-message">Authentication required for rating</p>
                    )}
                </div>
            ))}
        </div>
        </div>
    );
};

export default VideoList;
