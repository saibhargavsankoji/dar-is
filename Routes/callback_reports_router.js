
const express = require("express");
var callBackReportsRouter = express.Router();
const { Report } = require('../Helper/report'); 


callBackReportsRouter.post("/fetchReports", async (request, response) =>{
    await new Report(request, response, 'callbacks_table');
});

module.exports = { callBackReportsRouter };