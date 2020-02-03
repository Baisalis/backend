const router = require('express').Router();
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {jwtSecret} = require('../config/secret');

const Users = require('../users/user-model')

router.get('/signup', (req, res) => {
    if(req.headers.authorization) {
        bc.hash(req.headers.authorization, 8,(err, hash)=> {
            if(err) {
                res.status(500).json({
                    errorMessage: 'broken code',
                    message: err.message
                })
            }else {
                res.status(200).json({hash});
            }
        });
    }
})

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hash = bc.hashSync(password, 10);
    
        Users.add({username, password: hash})
        .then(id => {
            res.status(201).json({created: id})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                    errorMessage: "User account could not be created",
                    message: err.message
                });
            });
        })


router.post('/signin', (req, res) => {
  let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bc.compareSync(password, user.password)) {
        
        const token = signToken(user);

        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(err => {
      res.status(500).json({
            errorMessage: err.message
      });
    });
});

function signToken(user) {
  const payload = {
    userId: user.userId,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;