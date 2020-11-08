const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const collection = 'Clients';

/* GET Forms */
router.get('/', (req, res) => {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) console.log(err);
    else res.render('index', { docs: documents });
  });
});

/* POST a Form */
router.post('/', (req, res) => {
  db.getDB().collection(collection).insertOne(req.body, (err, result) => {
    if (err) console.log(err);
    else res.json(result);
  });
});

/* DELETE a Form */
router.delete('/', (req, res) => {
  db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(req.body.id) }, (err, result) => {
    if (err) console.log(err);
    else res.json(result);
  });
});

/* UPDATE a Form */
router.put('/', (req, res) => {
  const filter = { _id: db.getPrimaryKey(req.body.id) };
  delete req.body.id;
  db.getDB().collection(collection).findOneAndUpdate(filter,{ $set: req.body },{ returnOriginal: false },(err, result) => {
        if (err) console.log(err);
        else res.json(result);
      });
});

module.exports = router;
