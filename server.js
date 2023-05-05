const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = () =>
Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1)

const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    // res.status(200).json(`${req.method} request received to get notes`); //I don't know what this does but I commented this out and now it all works

    console.info(`${req.method} request received to get notes`);

    fs.readFile('./db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    }
)});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            fs.writeFile(
                './db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) => 
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
         );
        }
    });

    const response = {
        status: 'success',
        body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

console.log(__dirname);

app.listen(PORT, () =>
    console.log("App listening " + PORT)
);

//comment
