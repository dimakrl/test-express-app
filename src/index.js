"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.use(express.json());
app.get("/health", function (req, res) {
    res.json({
        healthy: true
    });
});
var PORT = 3000;
app.listen(3000, function () {
    console.log("Server on ".concat(PORT));
});
