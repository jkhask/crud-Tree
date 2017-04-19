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
    amt: Number,
    numbers: [Number]
  }
);

var Node = mongoose.model('Node', nodeSchema);

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all nodes
router.get('/getTree', (req, res) => {
  Node.find(function (err, nodes) {
    if (err) res.send(err);
    res.status(200).json(nodes);
  })
});

// Add a node
router.post('/sendNode', (req, res) => {
  var node = new Node(req.body);
  node.save((err, newNode) => {
    if (err) return res.send(err);
    req.app.io.emit('update', {success: true});
    res.status(200).json(newNode);
  });
});

// Edit a node
router.post('/editNode', (req, res) => {
  Node.findOneAndUpdate({"id":req.body.id}, {$set:req.body}, (err, old) => {
    if (err) return res.send(err);
    var response = {
      message: 'Edited node.'
    }
    req.app.io.emit('update', { success: true });
    res.send(response);
  });
});

// Delete a node
router.get('/deleteNode/:id', (req, res) => {
  Node.findOneAndRemove({"id":req.params.id}, (err, deleted) => {
    if (err) return res.send(err);
    var response = {
      message: 'Deleted node.',
      id: deleted.id
    }
    req.app.io.emit('update', { success: true });
    res.send(response);
  });
});


module.exports = router;