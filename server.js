const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.port || 3001;

const app = express();

// this is where our data lives
const dataNotes = require('./db/db.json');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.json(dataNotes);
});

// GET Route for notes page
app.get('/notes', (req, res) => {
  console.info(`${req.method} request received for /notes`);
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

// Wildcard route to direct users to the index.html
app.get('*', (req, res) => {
  console.log(`${req.method} request received for home page`);
  res.sendFile(path.join(__dirname, './public/index.html'))
});

function createNewNote(body, notesArray) {
  const newNote = body;
  if (!Array.isArray(notesArray))
      notesArray = [];
  
  if (notesArray.length === 0)
      notesArray.push(0);

  notesArray.push(newNote);
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArray, null, 3)
  );
  return newNote;
}

app.post('/api/notes', (req, res) => {
  const newNote = createNewNote(req.body, dataNotes);
  res.json(newNote);
});

function deleteNote(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
      let note = notesArray[i];
      if (note.id == id) {
          notesArray.splice(i, 1);
          fs.writeFileSync(
              path.join(__dirname, './db/db.json'),
              JSON.stringify(notesArray, null, 3)
          );
          break;
      }
  }
}

app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, dataNotes);
  res.json(true);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);