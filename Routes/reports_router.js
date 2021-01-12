const express = require('express');
var reportsRouter = express.Router();
const Database = require('../Helper/database');
const { database, Response } = require('../Helper/helper');
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
            customers.push({ ...x, ...customersArray[i],});
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
            customers.push({...x, ...customersArray[i], });
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
            customers.push({ ...x, ...customersArray[i],});
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
            customers.push({ ...x, ...customersArray[i],});
        }
    }

    for (var i = 0; i<customers.length; i++){
        if(customers[i].status === 'Closer'){
            RejectsArray.push(customers[i]);
        }
    }
    
    response.send(RejectsArray);
 
});

reportsRouter.get("/graphs/:id", async(request, response) => {
    let customerData = [];
    let Appointments = [];
    let Callbacks = [];
    let Closers = [];
    let Rejects = [];
    let retrivedCostomerData = []
    let responseData = {
        appointments : Appointments,
        callbacks : Callbacks,
        closers : Closers,
        rejects : Rejects
    };
    let employeeData = await (await Database.DB.query(`select * from add_employee`)).rows
    let data = await database(Database.DB, request, response).SELECT('add_employee', `employee_id = '${request.params.id}'`);

    const returnData = (customerData)=>{
        for(let customer of customerData){
            for(let employee of employeeData){
                if(employee.employee_id == customer.employee_id){
                  switch (customer.status) {
                      case 'Appointment':
                              Appointments.push({...employee ,...customer});
                          break;
                      case 'Callback':
                              Callbacks.push({...employee ,...customer});
                          break;
                      case 'Closer':
                              Closers.push({...employee ,...customer});
                          break;
                      case 'Reject':
                              Rejects.push({...employee ,...customer});
                          break;
                  
                      default:
                          break;
                  }
                }   
          } 
        }
    }

    switch (data[0].role) {
        case 'Admin':
          customerData = await (await Database.DB.query("select * from customer")).rows;
          returnData(customerData)
          break;
        
        case 'Telecaller':
            customerData = await (await Database.DB.query(`select * from customer where employee_id = '${request.params.id}'` )).rows; 
            returnData(customerData)
            // testing(customerData) 
          break;
    
        case 'Senior Team Leader':
            let TelecallersData = await (await Database.DB.query(`select * from add_employee where role = 'Telecaller' AND team_lead_id = '${request.params.id}'`)).rows
            subEmployeeData = [...data, ...TelecallersData]
            customerData = await (await Database.DB.query("select * from customer")).rows;

            for(const customer of customerData){
                for(const employee of subEmployeeData){
                    if(customer.employee_id === employee.employee_id){
                        retrivedCostomerData.push(customer);
                    }
                }
            }    

            returnData(retrivedCostomerData)
            break;
    
        case 'Branch Manager':
            customerData = await (await Database.DB.query(`select * from customer where branch = ${data[0].branch}`)).rows;
            returnData(customerData)
          break;
        
        case 'Sr. Relationship Manager':
          EmployeeData = await (await Database.DB.query(`select`)).rows;
          break;
    
        default:
          break;
    }

   response.send(responseData)   
});



module.exports = {
    reportsRouter
}