const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models');

const app = express();
app.use(bodyParser.json());

// send back all post from DATABASE_URL
app.get('/posts', (req, res) => {
  Blog
    .find()
    .exec()
    .then(blogs => {
      res.json({
        blogs: blogs.map(
          (blog) => blog.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

// request by ID
app.get('/posts/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .exec()
    .then(blog => res.json(blog.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
});

app.post('/posts', (req, res) => {

  const requiredFields = ['title', 'content', 'author'];
  for(let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Blog
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author})
      .then(
        blog => res.status(201).json(blog.apiRepr()))
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
        });
});

app.put('posts/:id', (req, res) => {
  // check if id in the request path
  // and the one in request body match
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (`Request path id (${req.params.id}) and request body` +
    `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updatableFields = ['title', 'content', 'author'];

  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Blog
    .findByIdAndUpdate(req.params.id,
    {$set: toUpdate})
    .exec()
    .then(
      blog => res.status(200).json(blog.apiRepr()))
      .catch(err => res.status(500).json({message: 'Internal server error'}));

});
