const express = require('express');
var appointmentsRouter = express.Router();
const { Report } = require('../Helper/report');



appointmentsRouter.post("/fetchReports", async (request, response) =>{
    await new Report(request, response, 'appointments_table');
});

module.exports = { appointmentsRouter }