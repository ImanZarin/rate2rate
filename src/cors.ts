/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express');
const cors = require('cors');

express();

const corsOptionsDelegate = (req, callback) => {
    let corsOption;
    if (process.env.WHITE_LIST.split(' ').indexOf(req.header('origin')) >= 0)
        corsOption = { origin: true };
    else
        corsOption = { origin: false };
    callback(null, corsOption);

};

exports.corsAll = cors();
exports.corsWithOption = cors(corsOptionsDelegate);