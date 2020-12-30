
const express = require("express");
var rejectReportsRouter = express.Router();
const { Report } = require('../Helper/report'); 


rejectReportsRouter.post("/fetchReports",async (request, response) =>{
    await new Report(request, response, 'rejects_table');
});

module.exports = { rejectReportsRouter };