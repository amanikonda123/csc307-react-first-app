import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = { 
    users_list : [
        { 
            id : 'xyz789',
            name : 'Charlie',
            job: 'Janitor',
        },
        {
            id : 'abc123', 
            name: 'Mac',
            job: 'Bouncer',
        },
        {
            id : 'ppp222', 
            name: 'Mac',
            job: 'Professor',
        }, 
        {
            id: 'yat999', 
            name: 'Dee',
            job: 'Aspring actress',
        },
        {
            id: 'zap555', 
            name: 'Dennis',
            job: 'Bartender',
        }
    ]
}

app.use(cors());
app.use(express.json());

const findUserByName = (name) => { 
    return users['users_list']
        .filter( (user) => user['name'] === name); 
}

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);

const findUserByJob = (job) =>
    users['users_list']
        .find( (user) => user['job'] === job);

const addUser = (user) => {
    const newUser = {
        id: generateRandomId(),
        name: user.name,
        job: user.job,
    }
    users['users_list'].push(newUser);
    return user;
}

const deleteUserById = (id) => {
    const index = users['users_list'].findIndex((user) => user['id'] === id);
    if (index !== -1) {
        users["users_list"] = users["users_list"].filter((user, i) => i !== index);
    }
    return index
}

// Reference used: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15530287
const generateRandomId = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
  
    const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigit = () => digits.charAt(Math.floor(Math.random() * digits.length));
    return randomLetter() + randomLetter() + randomLetter() + randomDigit() + randomDigit() + randomDigit();
  };
        
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    
    if (name !== undefined && job !== undefined) {
        let result = users['users_list'].filter((user) => user['name'] === name && user['job'] === job);
        result = { users_list: result };
        res.send(result);
    } else if (name !== undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else if (job !== undefined) {
        let result = findUserByJob(job);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});
    
app.get('/users/:id', (req, res) => {
    const id = req.params['id'];
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const newUser = addUser(userToAdd);
    res.status(201).send(newUser);
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const deletedUser = deleteUserById(id);
  
    if (deletedUser !== -1) {
        res.status(204).send();
    } else {
        res.status(404).send('Resource not found.');
    }
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});