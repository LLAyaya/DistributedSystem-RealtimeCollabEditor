const mongoose= require("mongoose")

const RoomSchema = new mongoose.Schema({
    roomId: { 
        type: Number, 
        unique: true, 
        required: true },
    roomPassword: { 
        type: String, 
        required: true },
    roomMembers: [Number],
});

module.exports = mongoose.model('Room', RoomSchema);