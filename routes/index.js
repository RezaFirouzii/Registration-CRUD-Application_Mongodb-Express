const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');
const collection = 'Clients';

/* GET Forms */
router.get('/', function(req, res, next) {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) console.log(err);
    else res.render('index', { docs: documents });
  });
});

module.exports = router;
