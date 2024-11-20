import React, { useState, useEffect } from "react";
import app from "./Login/firebase";
import "./Allarticles.css";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";

const AllArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const storage = getStorage(app);
                const articlesFolderRef = storageRef(storage, "articles/");

                // List all folders in the "articles/" directory
                const folderList = await listAll(articlesFolderRef);

                const fetchedArticles = await Promise.all(
                    folderList.prefixes.map(async (folderRef) => {
                        const folderName = folderRef.name;

                        // Get JSON file URL
                        const jsonFileRef = storageRef(storage, `articles/${folderName}/${folderName}.json`);
                        const jsonURL = await getDownloadURL(jsonFileRef);

                        // Fetch metadata from JSON file
                        const response = await fetch(jsonURL);
                        const metadata = await response.json();

                        // Get Image file URL
                        const imgFileRef = storageRef(storage, `articles/${folderName}/${folderName}jpg`);
                        const imgURL = await getDownloadURL(imgFileRef);

                        // Return complete article data
                        return { ...metadata, img_url: imgURL };
                    })
                );

                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="all-articles">
            <h1>All Articles</h1>
            <div className="articles">
                {articles.map((article) => (
                    <div className="article" key={article.id}>
                        <div className="article-image">
                            <img src={article.img_url} alt={article.title} />
                        </div>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <p>
                             by {article.author}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllArticles;
