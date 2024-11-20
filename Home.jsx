import React, { useState, useEffect} from "react";
import './Home.css';
import app from "./Login/firebase";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { FaFacebook, FaInstagram, FaTwitter} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';

const FeaturedArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    const fetchArticles = async () => {
        try {
            const storage = getStorage(app);
            const articlesFolderRef = storageRef(storage, "articles/");

            const folderList = await listAll(articlesFolderRef);

            const fetchedArticles = await Promise.all(
                folderList.prefixes.map(async (folderRef) => {
                    const folderName = folderRef.name;
                    const jsonFileRef = storageRef(storage, `articles/${folderName}/${folderName}.json`);
                    const jsonURL = await getDownloadURL(jsonFileRef);
                    const response = await fetch(jsonURL);
                    const metadata = await response.json();

                    const imgFileRef = storageRef(storage, `articles/${folderName}/${folderName}jpg`);
                    const imgURL = await getDownloadURL(imgFileRef);

                    return { ...metadata, img_url: imgURL };
                })
            );

            setArticles(fetchedArticles);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const articlesToShow = articles.slice(0, 3);

    if (loading) {
        return (
            <section className="featured-articles">
                <h2>Featured Articles</h2>
                <p>Loading featured Articles...</p>
            </section>
        );
    }

    return (
        <section className="featured-articles">
            <h2>Featured Articles</h2>
            <div className="articles">
                {articlesToShow.map((article, index) => (
                    <div className="article" key={article.id || index}> {/* Fallback to index if id is missing */}
                        <div className="article-image">
                            <img src={article.img_url} alt={article.title} />
                        </div>
                        <h3>{article.title}</h3>
                        <p>{article.articletxt}</p>
                        <p>
                             by {article.author}
                        </p>
                    </div>
                ))}
            </div>
            <br />
            <center>
                <Link to="/articles">
                    <button>See all articles</button>
                </Link>
            </center>
            <br />
        </section>
    );
};



const FeaturedTutorials = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getDatabase(app);
        const tutorialsRef = dbRef(db, 'videos');
        const unsubscribe = onValue(tutorialsRef, (snapshot) => {
            const data = snapshot.val();
            const tutorialArray = data
                ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
                : [];
            setTutorials(tutorialArray.slice(0, 3));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        <section className="featured-tutorials">
        <h2>Featured Tutorials</h2>
        <p>Loading featured Tutorials...</p>
    </section>
    }

    return (
        <section className="featured-tutorials">
            <h2>Featured Tutorials</h2>
            <div className="tutorials">
                {tutorials.map((tutorial) => (
                    <div className="tutorial" key={tutorial.id}>
                        <div className="tutorial-image">
                            <video controls width={300}>
                                <source src={tutorial.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <h3>{tutorial.title}</h3>
                        <p>Views: {tutorial.views}</p>
                        <p><span>&#11088;</span> {tutorial.rating} </p>
                    </div>
                ))}
            </div>
            <br />
            <Link to="/tutorials">
                <center><button>See all tutorials</button></center>
            </Link>
            <br />
        </section>
    );
};



const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubscribe = async () => {
      try {
        const response = await axios.post('http://localhost:5000/subscribe', { email });
        setMessage(response.data.message);
        setEmail('');
      } catch (error) {
        setMessage('Subscription failed. Please try again later.');
        console.log(error);
      }
      alert(message);
      console.log(message);
    };
  
    return(
      <div class="newsletter">
      <label for="email">SIGN UP FOR OUR DAILY INSIDER  </label>
      <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
    </div>
    );
  };
  

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-obj">
                <div className="explore">
                    <h4>Explore</h4>
                    <ul>
                        <li>Home</li>
                        <li>Questions</li>
                        <li>Articles</li>
                        <li>Tutorials</li>
                    </ul>
                </div>
                <div className="support">
                    <h4>Support</h4>
                    <ul>
                        <li>FAQs</li>
                        <li>Help</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className="social">
                    <h4>Stay Connected</h4>
                    <ul>
                        <li><FaFacebook style={{ width: 40, height: 40 }} /></li>
                        <li><FaTwitter style={{ width: 40, height: 40 }} /></li>
                        <li><FaInstagram style={{ width: 40, height: 40 }} /></li>
                    </ul>
                </div>
            </div>
            <div className="copyright">
                <p>DEV@Deakin 2024</p>
                <ul>
                    <li>Privacy Policy</li>
                    <li>Terms</li>
                    <li>Code of Conduct</li>
                </ul>
            </div>
        </footer>
    );
};

const Animation = () => {
  const tags = ["<div>", "<h1>", "<p>", "<html>", "<footer>", "<header>", "<span>", "<main>", "<ul>", "<li>", "<head>", "<marquee>"];

  return (
    <div
      style={{
        position: "relative",
        width: "200vh",
        height: "70vh",
        overflow: "hidden",
        background: "whitesmoke", // Dark background for better visibility
        color: "black",
        fontFamily: "monospace",
      }}
    >
      {tags.map((tag, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            fontSize: "4rem", // Making the tags big
            fontWeight: "bold",
            opacity: 0.8,
          }}
          animate={{
            x: [
              Math.random() * -200, // Start from off-screen (left or right)
              Math.random() * window.innerWidth, // Random horizontal positions
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * -100, // Start above the screen
              Math.random() * window.innerHeight, // Random vertical positions
              window.innerHeight + 50, // Exit below the screen
            ],
            rotate: [0, 360, 720], // Spin the tags
          }}
          transition={{
            duration: Math.random() * 3 + 2, // Random animation duration
            ease: "easeInOut",
            repeat: Infinity, // Loop forever
            repeatDelay: Math.random() * 1, // Random delay before looping
          }}
        >
          {tag}
        </motion.div>
      ))}
    </div>
  );
};

const Home = () => {
    return (
        <div>
            <center>
            <Animation/>
            </center>
            <br></br>         
            <FeaturedArticles />
            <FeaturedTutorials />
            <Newsletter />
            <Footer />
        </div>
    );
};

export default Home;
