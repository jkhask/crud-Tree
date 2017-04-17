const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongodb");
});

const nodeSchema = mongoose.Schema(
  {
    id: String,
    name: String,
    rangeLo: Number,
    rangeHi: Number,
    numbers: [Number]
  }
);

var testTree = [];

var Node = mongoose.model('Node', nodeSchema);

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all nodes
router.get('/getTree', (req, res) => {
  Node.find(function (err, nodes) {
    if (err) return console.error(err);
    res.status(200).json(nodes);
  })
  // res.status(200).json(testTree);
});

// Add a node
router.post('/sendNode', (req, res) => {
  var node = new Node(req.body);
  node.save((err, newNode) => {
    if (err) return console.error(err);
    res.send(newNode);
  });
  // testTree = req.body;
  // res.json(testTree);
});


module.exports = router;