import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"

import { UserModel } from "./models/data.js"
import { HomeWorkModel } from "./models/homeWork.js"
import { registerValidation } from "./validations/auth.js"
import { HomeWorkValidator } from "./validations/homeWork.js"

// CONNECT TO MONGO DB

mongoose.connect("mongodb+srv://ekalkabekov:Vs1nEOIZtqZT9IT6@cluster0.krjk31u.mongodb.net/Users?retryWrites=true&w=majority")
    .then(() => console.log("connected to DB !"))
    .catch((err) => console.log("not connect to DB !", err))

const app = express()

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001

// TEST GET REQUEST

app.get('/', (req, res) => {
    res.json({
        message: "Hello world !"
    })
})

// REGISTRATION NEW USER

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const reqData = req.body;
    
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.json(errors.array());
        }

        if (reqData.password !== reqData.passwordRepeat) {
            return res.json({
                message: "Пароли не совпадают !"
            })
        }
    
        const salt = await bcrypt.genSalt(10);
        const passwordHash =  await bcrypt.hash(reqData.password, salt);

        const doc = new UserModel({
            name: reqData.name,
            lastName: reqData.lastName,
            passwordHash,
            email: reqData.email,
            isTeacher: reqData.isTeacher ? true : false,
            group: reqData.group,
            isAdmin: reqData.isAdmin,
            lesson: reqData.lesson
        });
        const user = await doc.save();
        res.json(user)
    } catch (err) {
        console.log(err)

        res.json(err)
    }
});

// LOGIN USER

app.post('/auth/login', async (req, res) => {
    try {
        const reqData = req.body;
        
        const user = await UserModel.findOne({email: reqData.email})

        if (!user) {
            return res.json({
                message: "Пользователь не найден !"
            })
        }

        const isValidPass = await bcrypt.compare(reqData.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.json({
                message: "Неверный логин или пароль !"
            })
        }

        res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }
})

// CREATE NEW HOMEWORK  

app.post('/createHomeWork', HomeWorkValidator, async (req, res) => {
    try {
        const reqData = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json(errors.array());
        }

        const doc = new HomeWorkModel({
            title: reqData.title,
            info: reqData.info,
            group: reqData.group,
            lesson: reqData.lesson
        })

        const homeWork = await doc.save();

        res.json(homeWork);
    } catch (err) {
        console.log(err)
    }
})

// GET ALL HOMEWORKS LESSON

app.post('/getLessonHomeWork', async (req, res) => {
    try {
        const reqData = req.body;
        
        const data = await HomeWorkModel.find({'lesson': reqData.lesson, 'group': reqData.group})

        if (!data) {
            res.json({
                message: "ДЗ не найдено !"
            })
        }

        res.json(data)
    } catch (err) {
        console.log(err)
    }
})

app.post('/deleteHomeWork', async (req, res) => {
    try {
        const reqData = req.body;

        const data = await HomeWorkModel.deleteOne({'title': reqData.title, info: reqData.info})

        res.json(data)
    } catch (err) {
        console.log(err)
    }
})

// GET HOWEWORK

app.post('/getAllHomeWorks', async (req, res) => {
    try {
        const reqData = req.body;

        const data = await HomeWorkModel.findOne({'group': reqData.group})

        if (!data) {
            res.json({
                message: "Группа не найдена !"
            })
        }

        res.json(data)
    } catch (err) {
        console.log(err)
    }
})

// GET ALL DATA FROM DB

app.get('/getAllData', async (req, res) => {
    const data = await DataModel.find({})
    res.json(data)
})

// DELETE ALL USER FROM DB

app.get("/deleteAllData", async (req, res) => {
    const data = await DataModel.deleteMany({})
    res.json(data)
})

// DELETE ONE USER FROM DB

app.post("/deleteOneData", async (req, res) => {
    const reqData = req.body;

    console.log(reqData)

    let data = await DataModel.deleteOne({description: reqData.description})
    data = await DataModel.find({})
    res.json(data)
})

// STARTING BACKEND

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Servar start http://localhost:${PORT}`)
})