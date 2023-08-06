const notes = require('express').Router();
const { response } = require('.');
//const uuid = require('../helpers/uuid');

// Helper functions for reading and writing to the JSON file
const {
   readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// This API route is a GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  console.log('in notes get');
});

// This API route is a POST Route for a new UX/UI note
notes.post('/', (req, res) => {
  console.log(req.body);
  console.log('in notes post');
  console.info(`${req.method} request received to add a note`);

  const { noteTitle, noteText } = req.body;

  // see if there's any content in Title and Text
  if (noteTitle && noteText) {
    const newNote = {
      noteTitle,
      noteText,
    };

    readAndAppend(newNote, './db/db.json');
    res.json('Note added successfully');
    console.log('Post done');
  } else {
    response.error('Error in adding note');
  }
});

module.exports = notes;
