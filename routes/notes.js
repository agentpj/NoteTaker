const notes = require('express').Router();
//const uuid = require('../helpers/uuid');

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');

// This API route is a GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// This API route is a POST Route for a new UX/UI note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { noteTitle, noteText } = req.body;

  // see if there's any content in Title and Text
  if (noteTitle && noteText) {
    const newNotes = {
      noteTitle,
      noteText,
    };

    readAndAppend(newNotes, './db/db.json');
    res.json('Note added successfully 🚀');
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
