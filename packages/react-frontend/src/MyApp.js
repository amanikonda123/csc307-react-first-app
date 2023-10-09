import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from './Form';

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error('User data could not be parsed as JSON');
        }
      })
      .then((newUser) => {
        console.log('New User:', newUser);
        setCharacters((prevCharacters) => [...prevCharacters, newUser]);
        console.log('Updated Characters:', characters);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function removeOneCharacter (index) {
    deleteUser(characters[index])
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index
          });
          setCharacters(updated);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteUser(person) {
    const promise = fetch(`http://localhost:8000/users/${person.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return promise;
  }

  return (
    <div className="container">
      <Table characterData={characters} 
	      removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>  
  );
}

export default MyApp;