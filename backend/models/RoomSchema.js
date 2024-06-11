const mongoose = require('mongoose')

const RoomMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cursorLine: { type: Number, required: true, default: 0 },
    cursorChar: { type: Number, required: true, default: 0 },
})

const RoomSchema = new mongoose.Schema({
    roomId: { 
        type: Number, 
        unique: true, 
        required: true },
    roomMembers: [RoomMemberSchema],
    content: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('rooms', RoomSchema);