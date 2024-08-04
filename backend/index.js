const mongoose = require('mongoose');
const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

// Connect to mongo DB
try {
    mongoose.connect('mongodb://localhost:27017/', {
        dbName: 'classfinder',
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to classfinder database');
} catch (error) {
    console.log(error);
}

// Start websocket server
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
    console.log(`WebSocket server running on ${port}`);
});

const clients = {};

wsServer.on('connection', function (connection) {
    const userId = uuidv4();
    console.log(`New connection`);

    clients[userId] = connection;
    console.log(`${userId} joined the server.`);

    const handleDisconnect = (userId) => {
        console.log(`${userId} left the server.`);
        delete clients[userId];
    }

    connection.on('close', () => handleDisconnect(userId));
});

// Schema for meetings
const MeetingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
});

const Meeting = mongoose.model('meetings', MeetingSchema);

// Schema for classes
const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    days: {
        type: [Boolean]
    },
    startDate: { 
        type: Date, 
        required: true
    },
    endDate: { 
        type: Date,
        required: true 
    },
    teacher: {
        type: String
    },
    totalSeats: {
        type: Number,
        required: true
    },
    seatsLeft: {
        type: Number
    },
    meetings: {
        type: Array
    }
}, { timestamps: true });

const Class = mongoose.model('classes', ClassSchema);

const express = require('express');
const app = express();
const cors = require("cors");
const e = require('express');

console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (_, resp) => {
    resp.send("App is Working");
    // Check http://localhost:5000
});

app.post('/loadClasses', async (req, resp) => {
    try {
        const classes = await Class.find({});
        resp.json({ status: 201, classes: classes });
    } catch (e) {
        console.log(e);
    }
});

app.post('/createClass', async (req, resp) => {
    try {
        const daysChecked= req.body.days;
        let meetings = [];
        let startDate = new Date(moment.tz(req.body.startDate, "America/New_York"));
        const endDate = new Date(moment.tz(req.body.endDate, "America/New_York"));
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        while (startDate <= endDate) {
            if (daysChecked[startDate.getDay()]) {
                const date = new Date(startDate);
                const meeting = new Meeting({date: date, startTime: startTime, endTime: endTime});
                meetings.push(meeting);
            }
            startDate.setDate(startDate.getDate() + 1)
        }
        const course = new Class({name: req.body.name, startTime: req.body.startTime, endTime: req.body.endTime, startDate: moment.tz(req.body.startDate, "America/New_York"), endDate: moment.tz(req.body.endDate, "America/New_York"), days: daysChecked, totalSeats: req.body.maxSeats, seatsLeft: req.body.maxSeats, teacher: req.body.teacher, meetings: meetings});
        let result = await course.save();
        result = result.toObject();
        if (result) {
            resp.json({status: 200});
        } else {
            resp.json({status: 400});
        }
    } catch (e) {
        console.log(e);
    }
});

app.listen(5000);