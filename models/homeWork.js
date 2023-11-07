import mongoose from "mongoose";

const HomeWorkSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    info: {
        type: String,
        require: true,
    },
    group: {
        type: String,
        require: true,
    },
    lesson: {
        type: String,
        require: true,
    }
})

export const HomeWorkModel = mongoose.model('HomeWork', HomeWorkSchema)