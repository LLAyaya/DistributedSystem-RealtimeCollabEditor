const express = require('express')
const router = express.Router()
const User = require('../models/UserSchema')


// Get all 
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one 
router.get('/:id', getUser ,  async (req, res) => {
   res.json(res.user)
});

// Create 
router.post('/', async (req, res) => {
    const user = new User ({
        userName: req.body.userName,
        userPassword: req.body.userPassword
    })

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update 
router.patch('/:id',getUser,  async (req, res) => {
    if (req.body.userName != null ){
        res.user.userName = req.body.userName
    }
    if (req.body.userPassword != null ){
        res.user.userPassword = req.body.userPassword
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Delete 
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne()
        res.json({message: 'deleted user' })
    } catch (err) {
        res.status(500).json({ message: err.message})

    }
});


async function getUser(req, res, next){
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.user = user
    next()
}

module.exports = router;