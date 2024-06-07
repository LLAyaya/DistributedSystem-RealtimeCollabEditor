const mongoose= require("mongoose")

const RoomSchema = new mongoose.Schema({
    roomId: { 
        type: Number, 
        unique: true, 
        required: true },
    roomMembers: {
        type: [String],
        ref: 'users'
    },
    content: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('rooms', RoomSchema);