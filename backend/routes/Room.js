const express = require('express')
const router = express.Router()
const Room = require('../models/RoomSchema').default

// Get all 
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one 
router.get('/:id', getRoom ,  async (req, res) => {
    res.json(res.room)
});

// Create 
router.post('/', async (req, res) => {
    const room = new Room ({
        roomId: req.body.roomId,
        roomPassword: req.body.roomPassword
    })

    try {
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update 
router.patch('/:id',getRoom ,  async (req, res) => {
    if (req.body.roomId != null ){
        res.room.roomId = req.body.roomId
    }
    if (req.body.roomPassword != null ){
        res.room.roomPassword = req.body.roomPassword
    }
    try {
        const updatedRoom = await res.room.save()
        res.json(updatedRoom)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Delete 
router.delete('/:id', getRoom, async (req, res) => {
    try {
        await res.room.deleteOne()
        res.json({message: 'deleted room' })
    } catch (err) {
        res.status(500).json({ message: err.message})

    }
});


async function getRoom(req, res, next){
    try {
        room = await Room.findById(req.params.id)
        if (room == null){
            return res.status(404).json({ message: 'Cannot find room' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.room = room
    next()
}

module.exports = router;