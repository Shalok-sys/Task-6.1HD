import React, { useState, useEffect } from "react";
import app from '../Login/firebase';
import { ref, uploadString, uploadBytes, getStorage } from "firebase/storage";
import './App.css';
import { getAuth, onAuthStateChanged  } from "firebase/auth";

const ForArticle = () => {
  const [loggedUser, setloggedUser] = useState('');

  const auth = getAuth(app);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    articletxt: "",
    tags:"",
    author:"",
    image: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setloggedUser(user.email);
      } else {
        setloggedUser("Unknown");
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const handleChange = (event) => { // Changes the the values of form data for articles. Images are set differently becuase they are saved as a file. 
    const { name, value } = event.target;
    if (name === "image") {
      setFormData((prevFormData) => ({ ...prevFormData, image: event.target.files[0] }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const uploadartData = (event) => { // Data is uploaded to the storage of firebase because it is better to store files. Therefore, one file with .json and .jpg extension are saved.
    const storage = getStorage(app);
    event.preventDefault();
    console.log("Form Data: ", formData);
    const dirname = Date.now();
   formData.author =  loggedUser;

    if (formData.image) {
      const imageRef = ref(storage, `articles/${dirname}/${dirname}jpg`);
      uploadBytes(imageRef, formData.image).then((snapshot) => {
        console.log("Image uploaded successfully.");
        const storageRef = ref(storage, `articles/${dirname}/${dirname}.json`);
        uploadString(storageRef, JSON.stringify(formData)).then((snapshot) => {
          console.log("Data uploaded successfully.");
        });
      });
    } else {
      const storageRef = ref(storage, `articles/${Date.now()}/${Date.now()}.json`);
      uploadString(storageRef, JSON.stringify(formData)).then((snapshot) => {
        console.log("Data uploaded successfully.");
      });
    }

    alert("Data submitted");
    setFormData({
      title: "",
      abstract: "",
      articletxt: "",
      tags:"",
      image: null
    });
  }

    return(
      <div className="info-area">
      <p>This section is designed based on the type of the post. 
        It could be developed by conditional rendering.</p>
        <label for="title">Title  </label>
        <input type='text' name='title' id='title' placeholder='Enter a descriptive title' value={formData.title} onChange={handleChange}/><br></br><br></br>
        
        <label for="image">Add an Image: </label>
        <input type='file' name='image' id='image' onChange={handleChange} accept="image/*"/><br></br><br></br>

        <label for="abstract">Abstract</label><br></br>
        <textarea id='abstract' className="textar" rows={4} placeholder='Enter a 1-paragraph abstract'value={formData.abstract} onChange={handleChange} name="abstract"></textarea><br></br><br></br>
  
        <label for="articletxt">Article Text</label><br></br>
        <textarea id='articletxt' className="textar" rows={10} placeholder='Enter a 1-paragraph abstract'value={formData.articletxt} onChange={handleChange} name="articletxt"></textarea><br></br><br></br>
  
        <label for="tags">Tags </label>
        <input type='text' id='tags' placeholder='Please add up to 3 tags to describe what your question is about e.g., Java' value={formData.tags} onChange={handleChange} name="tags"/><br></br>
        <button className="submit-butn" onClick={uploadartData}>Post</button>
      </div>
    );
  };

  export default ForArticle;