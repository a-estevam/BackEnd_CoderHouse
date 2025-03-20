const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  let user = {
    name: 'João',
    last_name: 'Rezende'
  };

  res.render('index', user);
});

module.exports = router;
