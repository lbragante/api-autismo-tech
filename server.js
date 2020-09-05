const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const watson = require('./watson/client-watson');
const assistantId = '25952f91-267e-4a00-876f-6d99268fbb1c'


const app = express();
require('dotenv/config');


// Middlewares
app.use(cors());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({
    extended: false
}));


// Imports routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mentoringRoutes = require('./routes/mentoring.routes');
const conversation = require('./routes/conversation.routes');

// Routes
//app.use('/api/conversation',conversation);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mentoring', mentoringRoutes);



// Connect DB
mongoose.connect(process.env.DB_CONNECTION_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', () => {
    console.log('Database connect error');
});

db.once('open', () => {
    console.log('Database is connected');
});


app.post('/mensagem', async (req, res) => {
    await createSessionAndSendMessage(req, res);
});

app.post('/conversation/:sessionId*?', async (req, res) => {
    // send payload to Conversation and return result
    await sendMessage(req, res, req.params.sessionId, req.body.text);
});

app.delete('/conversation/:sessionId*?', async (req, res) => {
    // delete a session
    await deleteSession(req.params.sessionId);
});

const createSessionAndSendMessage = async (req, res) => {
    await watson.createSession(
        {
            assistantId: process.env.ASSISTANT_ID || assistantId,
        },
        (error, response) => {
            if (error) {
                console.log(error);
            } else {
                const sessionId = response.result.session_id;
                console.log(req.params)

                sendMessage(req, res, sessionId, req.body.text);
            }
        },
    );
};

const sendMessage = async (req, res, sessionId, text) => {
    await watson.message({
        assistantId,
        sessionId,
        input: {
            message_type: 'text',
            text,
        },
    }, (err, data) => {
        if (err) {
            if (err.message == 'Invalid Session') {
                return createSessionAndSendMessage(req, res);
            }
            console.log(err);
            return res.status(err.code || 500).json(err);
        }
        const cognitiveResponse = { intents: data.result.output.intents || [], entities: data.result.output.entities || [], code: data.result.output.generic[0].text }

        return res.json({ sessionId, cognitiveResponse });
    });
};


// Listen
app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT}`);
});

