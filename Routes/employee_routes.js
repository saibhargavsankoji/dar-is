// @ts-check
var express = require('express');
var router = express.Router();
const { database, Response } = require('../Helper/helper');
const Database = require('../Helper/database');
const { response } = require('express');

router.post('/add', async (request, response) => {
  let employeeExist = async () => {
    let rows = await (await Database.DB.query('SELECT employee_id FROM employees')).rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].employee_id === request.body.employee_id) return true;
    }
    return false;
  }

  try {
    let status = await database(Database.DB, request, response).INSERT('employees', await employeeExist());

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
    rows = await database(Database.DB, request, response).SELECT('employees');
    response.status(200).send(new Response(await rows, 200)).end();
  } catch (e) {
    response.status(400).send(e).end();
  }
});

router.get('/select/:id', async (request, response) => {
  var rows;
  try {
    rows = await database(Database.DB, request, response).SELECT('employees', `employee_id = '${request.params.id}'`);
    response.status(200).send(new Response(await rows, 200)).end();
  } catch (e) {
    response.status(400).send(e).end();
  }
});

router.get('/delete/:id', async (request, response) => {
  try {
    let rowCount = await database(Database.DB, request, response).DELETE('employees', 'employee_id');

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
    let rowCount = await database(Database.DB, request, response).UPDATE('employees', `employee_id = ${request.body.employee_id}`);
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
    let data = await database(Database.DB, request, response).SELECT('employees', `employee_id = ${request.body.employee_id}`);

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

  const rows = await (await Database.DB.query("select * from employees where designation = 'Telecaller'")).rows

response.send(rows);
});


router.get('/all', async (request, response)=>{
  const rows = await (await Database.DB.query("select * from employees")).rows
  response.send(rows);
})




router.get('/role/:id', async (request, response)=>{
  let EmployeeData = [];
  let TeamLeads ;
  let TeamLeadsArray = [];
  let SeniorTeamLeads;
  let SeniorTeamLeadsArray = [];
  let Telecallers;
  let TelecallersArray = [];
  let RelationshipManager;
  
  let data = await database(Database.DB, request, response).SELECT('employees', `employee_id = '${request.params.id}'`);
  
  switch (data[0].role) {
    
    case 'CEO':
    case 'NSM':
    case 'RSM':
      EmployeeData = await (await Database.DB.query("select * from employees")).rows;
    break;
   

    case 'Zonal Manager':
      EmployeeData = await (await Database.DB.query(`select * from employees where location = '${data[0].location}'`)).rows
    break;

    case 'Branch Manager':
      EmployeeData = await (await Database.DB.query(`select * from employees where branch = '${data[0].branch}'`)).rows
    break;
    
    case 'Sr. Relationship Manager':
      RelationshipManager = await (await Database.DB.query(`select * from employees where role = 'Relationship Manager' or higher_position = '${data[0].employee_id}'`)).rows
      EmployeeData = [...RelationshipManager, ...data[0]]
    break;

    case 'Relationship Manager':
      EmployeeData = data;
    break;
      
    case "Telesales Manager":
      SeniorTeamLeads = await (await Database.DB.query(`select * from employees where role='Senior Team Leader' and higher_position = '${data[0].employee_id}'`));
      TeamLeads = await (await Database.DB.query(`select * from employees where role='Team Lead'`)).rows;
      Telecallers = await (await Database.DB.query(`select * from employees where role='Telecaller'`)).rows;

      for(const telecaller of Telecallers){
        for(const TeamLead of TeamLeads){
            if(telecaller.higher_position === TeamLead.employee_id){
                TelecallersArray.push(telecaller);
            }
        }            
      }

 
        for(const Telecaller of Telecallers){
          for(const TeamLead of TeamLeads){
            if(Telecaller.higher_position === TeamLead.employee_id){
              TelecallersArray.push(Telecaller);
            }
          }
        }

      EmployeeData = [...TelecallersArray, ...TeamLeadsArray, ...SeniorTeamLeadsArray, ...data[0]];
    break;

    case 'Senior Team Lead':
      TeamLeads = await (await Database.DB.query(`select * from employees where role = 'Team Lead' AND higher_position = '${request.params.id}'`)).rows
      Telecallers = await (await Database.DB.query(`select * from employees where role = 'Telecaller'`)).rows;

      for(const telecaller of Telecallers){
          for(const TeamLead of TeamLeads){
              if(telecaller.higher_position === TeamLead.employee_id){
                  TelecallersArray.push(telecaller);
              }
          }            
      }

      EmployeeData = [ ...TeamLeads, ...TelecallersArray, ...data[0]];
    break;  

    case "Team Lead" :
      Telecallers = await (await Database.DB.query(`select * from employees where role = 'Telecaller' AND higher_position = '${request.params.id}'`)).rows
      EmployeeData = [...data, ...Telecallers]
    break;

    case 'Telecaller':
      EmployeeData = data;
    break;

    default:
    break;
  }
  
response.send(EmployeeData);

});


module.exports = { router };