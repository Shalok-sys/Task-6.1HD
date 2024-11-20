import React, { useState, useEffect} from 'react';
import { getDatabase, ref, remove, get, child} from "firebase/database";
import app from '../Login/firebase';
import './Search.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const SearchBar = () => {
  const db = getDatabase(app);
  const dbref = ref(db);
// Database is stored in the getDatabase() method along with a variable that refers to the directory in which we want to store the questions after post button is clicked. 

  const [searchItem, setSearchItem] = useState('')
  const [questions, setQuestions] = useState({})
  const [filteredQuestions, setFilteredQuestions] = useState({})
  // Search Item is used for storing the item that was searched in the search bar, questions are the actual object that is recieved after accessing the directory from the questionsRef variable. 
  // Filtered questions are the set of questions that are to be show below the search bar. Primarily, this will be used to display the questions. The initial value of the filtereed questions would be questions. 

  const [selectedValue, setSelectedValue] = useState('title'); // This state is used for checking the filter through which we want to filter our results. 
  const options = [ // These are all the options through the which a user can filter the results. 
  { value: 'title', label: 'Title' },
  { value: 'description', label: 'Description' },
  { value: 'tag', label: 'Tag' },
  { value: 'date', label: 'Date'},
  ];

// A simple get method is used to get the value whenever, it is called/ the componnet renders.
  get(child(dbref, '/questions' )).then((snapshot) => { 
    if (snapshot.exists()) {
      setQuestions({...snapshot.val()});
    } else {
      setQuestions({});
    }
  }).catch((error) => {
    console.error(error);
  });

  //useEffect is used so that whenever questions, searchitem, or the selected value for filter changes. 
  useEffect(() => {
    if (searchItem === '') {
      setFilteredQuestions(questions);
    } else {
    if (selectedValue === 'title'){
      const filteredQuestions = Object.fromEntries(
        Object.entries(questions).filter(([key, question]) => 
          question.title.toLowerCase().includes(searchItem.toLowerCase())
        )
      );
      setFilteredQuestions(filteredQuestions);
    }}
    if (selectedValue === 'description'){
      const filteredQuestions = Object.fromEntries(
        Object.entries(questions).filter(([key, question]) => 
          question.description.toLowerCase().includes(searchItem.toLowerCase())
        )
      );
      setFilteredQuestions(filteredQuestions);
    }
    if (selectedValue === 'tag'){
      const filteredQuestions = Object.fromEntries(
        Object.entries(questions).filter(([key, question]) => 
          question.tag.toLowerCase().includes(searchItem.toLowerCase())
        )
      );
      setFilteredQuestions(filteredQuestions);
    }
    if (selectedValue === 'date'){
      const filteredQuestions = Object.fromEntries(
        Object.entries(questions).filter(([key, question]) => 
          question.date.toLowerCase().includes(searchItem.toLowerCase())
        )
      );
      setFilteredQuestions(filteredQuestions);
    }
  }, [questions, searchItem, selectedValue]);

  const handleInputChange = (e) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
  }
  

  return (
    <div className='center-greybg'>
      <br></br>
      <div className='input-container'>
      <input
        type="text"
        value={searchItem}
        onChange={handleInputChange}
        placeholder='Type to search 🔍'
      />
      </div>

      Filter By <select
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}>
      {options.map((option) => (
      <option key={option.value} value={option.value}>
      {option.label}
      </option>
      ))}
      </select>
      <ul> 
        {Object.keys(filteredQuestions).map((key, index) => (
          <li key={key}>
            <h4>Title: {filteredQuestions[key].title}</h4>
            <p>Description: {filteredQuestions[key].description}</p>
            <p>Tags: {filteredQuestions[key].tag}</p>
            <p>Date: {filteredQuestions[key].date}</p>
            <button onClick={() => {
              remove(ref(db, 'questions/' + key))
              .then(() => {
                alert("Data deleted successfully.");
              })
              .catch((error) => console.log(error));
            }}>Delete</button> 
              <Popup
              trigger={<button>View</button>}
              position="right center"
              contentStyle={{
                width: '300px',
                padding: '20px',
                backgroundColor: '#f1f1f1',
                textAlign: 'center',
              }}
            >
            <h4>Title: {filteredQuestions[key].title}</h4>
            <p>Description: {filteredQuestions[key].description}</p>
            <p>Tags: {filteredQuestions[key].tag}</p>
            <p>Date: {filteredQuestions[key].date}</p>
            Code: <pre> <code>{filteredQuestions[key].code}</code> </pre>
            </Popup>
          </li>
        ))}
      </ul>
    </div>
  )
};  

export default SearchBar;