const express = require('express');
var reportsRouter = express.Router();
const Database = require('../Helper/database');
const {Report} = require('../Helper/report');

reportsRouter.post("/appointments", async(request, response) => {
    
    const customers = [];
    const AppointmentsArray = [];

    const employeeBranch = async ()=>{
        let rows = await (await Database.DB.query(`select * from add_employee where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }

    let customersArray = await (await Database.DB.query(`select * from customer where appointment_date > '${request.body.start_date}' AND appointment_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for(var i =0 ; i< customersArray.length; i++){
        if( customersArray[i].branch === x.branch){
            customers.push({...customersArray[i], ...x});
        }
    }

    for (var i = 0; i<customers.length; i++){
        if(customers[i].status === 'Appointment'){
            AppointmentsArray.push(customers[i]);
        }
    }
    
    response.send(AppointmentsArray);
 
});

reportsRouter.post("/callbacks", async(request, response) => {
    
    const customers = [];
    const CallbacksArray = [];

    const employeeBranch = async ()=>{
        let rows = await (await Database.DB.query(`select * from add_employee where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }
    
    let customersArray = await (await Database.DB.query(`select * from customer where callback_date > '${request.body.start_date}' AND callback_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for(var i =0 ; i< customersArray.length; i++){
        if( customersArray[i].branch === x.branch){
            customers.push({...customersArray[i], ...x});
        }
    }

    for (var i = 0; i<customers.length; i++){
        if(customers[i].status === 'Callback'){
            CallbacksArray.push(customers[i]);
        }
    }
    
    response.send(CallbacksArray);
 
});

reportsRouter.post("/rejects", async(request, response) => {
    
    const customers = [];
    const RejectsArray = [];

    const employeeBranch = async ()=>{
        let rows = await (await Database.DB.query(`select * from add_employee where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }
    
    let customersArray = await (await Database.DB.query(`select * from customer where appointment_date > '${request.body.start_date}' AND appointment_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for(var i =0 ; i< customersArray.length; i++){
        if( customersArray[i].branch === x.branch){
            customers.push({...customersArray[i], ...x});
        }
    }

    for (var i = 0; i<customers.length; i++){
        if(customers[i].status === 'Reject'){
            RejectsArray.push(customers[i]);
        }
    }
    
    response.send(RejectsArray);
 
});

reportsRouter.post("/closers", async(request, response) => {
    
    const customers = [];
    const RejectsArray = [];

    const employeeBranch = async ()=>{
        let rows = await (await Database.DB.query(`select * from add_employee where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }
    
    let customersArray = await (await Database.DB.query(`select * from customer where appointment_date > '${request.body.start_date}' AND appointment_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for(var i =0 ; i< customersArray.length; i++){
        if( customersArray[i].branch === x.branch){
            customers.push({...customersArray[i], ...x});
        }
    }

    for (var i = 0; i<customers.length; i++){
        if(customers[i].status === 'Closer'){
            RejectsArray.push(customers[i]);
        }
    }
    
    response.send(RejectsArray);
 
});

module.exports = {
    reportsRouter
}