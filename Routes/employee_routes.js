// @ts-check
var express = require('express');
var router = express.Router();
const { database, Response } = require('../Helper/helper');
const Database = require('../Helper/database');
const { response } = require('express');

router.post('/add', async (request, response) => {
  let employeeExist = async () => {
    let rows = await (await Database.DB.query('SELECT employee_id FROM add_employee')).rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].employee_id === request.body.employee_id) return true;
    }
    return false;
  }

  try {
    let status = await database(Database.DB, request, response).INSERT('add_employee', await employeeExist());

    if (status === 200) {
      response.status(200).send(new Response('Success', 200)).end();
    } else {
      response.status(200).send(new Response('Employee Already Existed', 302)).end();
    }
  } catch (e) {
    response.status(400).send(e).end();
  }
});

router.get('/select', async function (request, response) {
  var rows;
  try {
    rows = await database(Database.DB, request, response).SELECT('add_employee');
    response.status(200).send(new Response(await rows, 200)).end();
  } catch (e) {
    response.status(400).send(e).end();
  }
});

router.get('/select/:id', async (request, response) => {
  var rows;
  try {
    rows = await database(Database.DB, request, response).SELECT('add_employee', `employee_id = '${request.params.id}'`);
    response.status(200).send(new Response(await rows, 200)).end();
  } catch (e) {
    response.status(400).send(e).end();
  }
});

router.get('/delete/:id', async (request, response) => {
  try {
    let rowCount = await database(Database.DB, request, response).DELETE('add_employee', 'employee_id');

    if (rowCount) {
      response.status(200).send(new Response('Deleted Successfully', 200)).end();
    } else {
      response.status(200).send(new Response('Not Found', 404)).end();
    }
  } catch (e) {
    response.status(400).send(e).end();
  }
});

router.post('/update', async (request, response) => {
 
  // try {
    let rowCount = await database(Database.DB, request, response).UPDATE('add_employee', `employee_id = ${request.body.employee_id}`);
    if (rowCount) {
      response.status(200).send(new Response(rowCount[0], 200)).end();
    } else {
      response.status(200).send(new Response('Not Found', 404)).end();
    }
  // } catch (e) {
  //   response.status(400).send(e).end();
  // }
});

router.post('/login', async (request, response) => {
  try {
    let data = await database(Database.DB, request, response).SELECT('add_employee', `employee_id = ${request.body.employee_id}`);

    if (data !== undefined) {
      if (data.length === 0) {
        response.status(200).send(new Response('Not Found', 404)).end();
      } else if (request.body.password !== data[0].password) {
        response.status(200).send(new Response('wrong password', 401)).end();
      } else {
        response.status(200).send(new Response(data[0], 200)).end();
      }
    } else {
      response.status(200).send(new Response('Bad Request', 400)).end();
    }
  } catch (e) {
    new Error(e);
    response.status(500).send(e.message).end();
  }
});


router.get('/telecallers', async (request, response) => {

  const rows = await (await Database.DB.query("select * from add_employee where designation = 'Telecaller'")).rows

response.send(rows);
});


router.get('/all', async (request, response)=>{
  const rows = await (await Database.DB.query("select * from add_employee")).rows
  response.send(rows);
})




router.get('/role/:id', async (request, response)=>{
  let EmployeeData = [];
  let data = await database(Database.DB, request, response).SELECT('add_employee', `employee_id = '${request.params.id}'`);
  
  switch (data[0].role) {
    case 'Admin':
      EmployeeData = await (await Database.DB.query("select * from add_employee")).rows;
      break;

    case 'Telecaller':
      EmployeeData = data;
      break;

    case 'Senior Team Leader':
        let TelecallersData = await (await Database.DB.query(`select * from add_employee where role = 'Telecaller' AND team_lead_id = '${request.params.id}'`)).rows
        EmployeeData = [...data, ...TelecallersData]
        break;

    case 'Branch Manager':
      EmployeeData = await (await Database.DB.query("select * from add_employee where role = 'Telecaller' or role = 'Sr. Telecaller'")).rows
      break;
    
    case 'Sr. Relationship Manager':
      EmployeeData = await (await Database.DB.query(`select`)).rows;
      break;

    default:
      break;
  }
response.send(EmployeeData);

});


module.exports = { router };