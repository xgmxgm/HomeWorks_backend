import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        require: true,
    },
    isTeacher: {
        type: Boolean,
        require: true,
    },
    lesson: {
        type: String,
        require: true,
    },
    group: {
        type: String,
        require: true,
    },
    isAdmin: {
        type: Boolean,
    }
});

export const UserModel = mongoose.model('User', UserSchema);