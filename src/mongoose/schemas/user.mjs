import mongoose from "mongoose";

//this userSCchema
const userSchema  = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,

    }
})

export const user = mongoose.model('user', userSchema);

