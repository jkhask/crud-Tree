const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongodb");
});

const treeSchema = mongoose.Schema([{
  id: String,
  name: String,
  rangeLo: Number,
  rangeHi: Number,
  numbers: [Number]
}]);

var testTree = [];

var Tree = mongoose.model('Tree', treeSchema);

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all nodes
router.get('/getTree', (req, res) => {
  // Tree.find(function (err, nodes) {
  //   if (err) return console.error(err);
  //   res.status(200).json(nodes);
  // })
  res.status(200).json(testTree);
});

// Add a node
router.post('/sendTree', (req, res) => {
  // var tree = new Tree(req.body);
  // tree.save((err, newTree) => {
  //   if (err) return console.error(err);
  //   res.send(newTree);
  // });
  testTree = req.body;
  res.json(testTree);
});


module.exports = router;