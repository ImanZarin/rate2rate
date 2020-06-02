import { Constants } from "app.constants";

const express = require('express');
const cors = require('cors');

const app = express();

var corsOptionsDelegate = (req, callback) => {
    var corsOption;
    if (Constants.whiteList.indexOf(req.header('origin')) >= 0)
        corsOption = { origin: true };
    else
        corsOption = { origin: false };
    callback(null, corsOption);

};

exports.corsall = cors();
exports.corsWithOption = cors(corsOptionsDelegate);