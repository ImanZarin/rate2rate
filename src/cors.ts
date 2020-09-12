/* eslint-disable @typescript-eslint/no-var-requires */
import { Constants } from "src/app.constants";

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

exports.corsall = cors();
exports.corsWithOption = cors(corsOptionsDelegate);