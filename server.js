const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const watson = require('./watson/client-watson');


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

app.post('/mensagem', (req, resp) => {
    const { text } = req.body;
    const assistant_id = '25952f91-267e-4a00-876f-6d99268fbb1c'
    let session = ''

    watson.createSession({
        assistantId: assistant_id
    })
        .then(res => {
            //console.log(JSON.stringify(res.result, null, 2));
            session = res.result.session_id;    
            watson.messageStateless(
                {
                    assistantId: '25952f91-267e-4a00-876f-6d99268fbb1c',
                    sessionId: session,
                    input: {
                        'message_type': 'text',
                        'text': text
                    }
                })
                .then(res => {
                    console.log(JSON.stringify(res.result, null, 2));
                    resp.json(res.result)
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        });

});



// Listen
app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT}`);
});

