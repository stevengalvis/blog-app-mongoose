const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  titile: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};
