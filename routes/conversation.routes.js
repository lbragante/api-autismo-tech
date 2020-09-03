const express = require('express');
const router = express.Router();

// const watson = require('../watson/client-watson');

router.post('/mensagem', (req, res) => {
    res.send("teste")
    // const { text, context = {} } = req.body;

    // const params = {
    //     input: { text },
    //     workspace_id: '3edf767d-69ff-48fa-ba1e-0c5bf01bb2be',
    //     context,
    // };

    // watson.message(params, (err, response) => {
    //     if (err) res.status(500).json(err);
    //     res.json(response);
    // });
});