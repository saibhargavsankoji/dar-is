const { request, response } = require("express");
var express = require("express");
var existingCustomer = express.Router();
const { Report } = require('../Helper/report');
const { database, Response } = require('../Helper/helper');
const Database = require('../Helper/database');



existingCustomer.post('/customerdetails', async (request, response) => {
    await new Report(request, response, 'customer').ExistingCustomer();
}); 

// existingCustomer.post('/updateCustomer', async (request, response) => {

//     let employeeValidation = async () => {
//         // let rows = await (await Database.DB.query('SELECT * FROM designation')).rows;
//         // for (var i = 0; i < rows.length; i++) {
//         //   if (rows[i].mobile === request.body.mobile) 
//         //   return true;
//         // }
//         // return false;
//         return request.body.mobile;
//       }

//       try {
//         let status = await database(Database.DB, request, response).UPDATE('customer', await employeeValidation());
    
//         let rows = await (await Database.DB.query('SELECT * FROM designation')).rows;
    
//         if (status === 200) {
//           response.status(200).send(new Response(rows, 200)).end();
//         } else {
//           response.status(200).send(new Response('Branch Already Existed', 302)).end();
//         }
//       } catch (e) {
//         response.status(400).send(e).end();
//       }

// });

module.exports = {existingCustomer};