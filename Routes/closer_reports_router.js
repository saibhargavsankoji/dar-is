
const express = require("express");
var closerReportsRouter = express.Router();
const { Report } = require('../Helper/report'); 


closerReportsRouter.post("/fetchReports", async (request, response) =>{
    await new Report(request, response, 'closers_table');
});

module.exports = { closerReportsRouter };