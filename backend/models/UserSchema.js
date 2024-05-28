const mongoose= require("mongoose")

const UserSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true },
    userPassword: { 
        type: String, 
        required: true },
    userRoomIds: [Number],
});

module.exports = mongoose.model('User', UserSchema);
