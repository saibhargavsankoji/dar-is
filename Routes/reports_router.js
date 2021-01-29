const express = require('express');
var reportsRouter = express.Router();
const Database = require('../Helper/database');
const {
    database,
    Response
} = require('../Helper/helper');
const {
    Report
} = require('../Helper/report');

reportsRouter.post("/appointments", async (request, response) => {

    const customers = [];
    const AppointmentsArray = [];

    const employeeBranch = async () => {
        let rows = await (await Database.DB.query(`select * from employees where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }

    let customersArray = await (await Database.DB.query(`select * from customer where appointment_date > '${request.body.start_date}' AND appointment_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for (var i = 0; i < customersArray.length; i++) {
        if (customersArray[i].branch === x.branch) {
            customers.push({
                ...x,
                ...customersArray[i],
            });
        }
    }

    for (var i = 0; i < customers.length; i++) {
        if (customers[i].status === 'Appointment') {
            AppointmentsArray.push(customers[i]);
        }
    }

    response.send(AppointmentsArray);

});

reportsRouter.post("/callbacks", async (request, response) => {

    const customers = [];
    const CallbacksArray = [];

    const employeeBranch = async () => {
        let rows = await (await Database.DB.query(`select * from employees where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }

    let customersArray = await (await Database.DB.query(`select * from customer where callback_date > '${request.body.start_date}' AND callback_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for (var i = 0; i < customersArray.length; i++) {
        if (customersArray[i].branch === x.branch) {
            customers.push({
                ...x,
                ...customersArray[i],
            });
        }
    }

    for (var i = 0; i < customers.length; i++) {
        if (customers[i].status === 'Callback') {
            CallbacksArray.push(customers[i]);
        }
    }

    response.send(CallbacksArray);

});

reportsRouter.post("/rejects", async (request, response) => {

    const customers = [];
    const RejectsArray = [];

    const employeeBranch = async () => {
        let rows = await (await Database.DB.query(`select * from employees where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }

    let customersArray = await (await Database.DB.query(`select * from customer where appointment_date > '${request.body.start_date}' AND appointment_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for (var i = 0; i < customersArray.length; i++) {
        if (customersArray[i].branch === x.branch) {
            customers.push({
                ...x,
                ...customersArray[i],
            });
        }
    }

    for (var i = 0; i < customers.length; i++) {
        if (customers[i].status === 'Reject') {
            RejectsArray.push(customers[i]);
        }
    }

    response.send(RejectsArray);

});

reportsRouter.post("/closers", async (request, response) => {

    const customers = [];
    const RejectsArray = [];

    const employeeBranch = async () => {
        let rows = await (await Database.DB.query(`select * from employees where employee_id = ${request.body.id}`)).rows;
        return rows[0];
    }

    let customersArray = await (await Database.DB.query(`select * from customer where appointment_date > '${request.body.start_date}' AND appointment_date < '${request.body.end_date}'`)).rows;
    // let customersArray = await( await (await Database.DB.query("select * from customer where status = 'Appointment'")).rows)

    const x = await employeeBranch();
    for (var i = 0; i < customersArray.length; i++) {
        if (customersArray[i].branch === x.branch) {
            customers.push({
                ...x,
                ...customersArray[i],
            });
        }
    }

    for (var i = 0; i < customers.length; i++) {
        if (customers[i].status === 'Closer') {
            RejectsArray.push(customers[i]);
        }
    }

    response.send(RejectsArray);

});

reportsRouter.get("/graphs/:id", async (request, response) => {
    let customerData = [];
    let Appointments = [];
    let today = new Date().toLocaleDateString();
    let Callbacks = [];
    let Closers = [];
    let Rejects = [];
    let retrivedCostomerData = []

    let Telecallers = [];
    let TelecallersArray = [];
    let TeamLeads = [];
    let TeamLeadsArray = [];
    let TotalEmployeesArray = [];
    let Customers = [];
    let CustomersArray = [];


    let responseData = {
        appointments: Appointments,
        callbacks: Callbacks,
        closers: Closers,
        rejects: Rejects
    };
    let employeeData = await (await Database.DB.query(`select * from employees`)).rows
    let data = await database(Database.DB, request, response).SELECT('employees', `employee_id = '${request.params.id}'`);

    const returnData = (customerData) => {
        for (let customer of customerData) {
            for (let employee of employeeData) {
                if (employee.employee_id == customer.employee_id) {
                    switch (customer.status) {
                        case 'Appointment':
                            Appointments.push({
                                ...employee,
                                ...customer
                            });
                            break;
                        case 'Callback':
                            Callbacks.push({
                                ...employee,
                                ...customer
                            });
                            break;
                        case 'Closer':
                            Closers.push({
                                ...employee,
                                ...customer
                            });
                            break;
                        case 'Reject':
                            Rejects.push({
                                ...employee,
                                ...customer
                            });
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
            customerData = await (await Database.DB.query(`select * from customer where appointment_date = '${today}'`)).rows;
            returnData(customerData)
            break;

        case 'Branch Manager':
            let branchCustomers = [];
            // customerData = await (await Database.DB.query(`select * from customer where branch = '${data[0].branch}'`)).rows;
            customerData = await (await Database.DB.query(`select * from customer where appointment_date = '${today}' or callback_date = '${today}'`)).rows;

            customerData.map((customer) => {
                if (customer.branch === data[0].branch) {
                    branchCustomers.push(customer);
                }
            })

            returnData(branchCustomers)
            break;

        case 'Telesales Manager':
 
            let SeniorTeamLeads = await (await Database.DB.query(`select * from employees where role='Senior Team Leader' and higher_position = '${data[0].employee_id}'`)).rows;
            TeamLeads = await (await Database.DB.query(`select * from employees where role='Team Lead'`)).rows;
            Telecallers = await (await Database.DB.query(`select * from employees where role='Telecaller'`)).rows;
            Customers = await (await Database.DB.query(`select * from customers where branch = '${data[0].branch}'`)).rows;

            for (const teamLead of TeamLeads) {
                for (const seniorTeamLead of SeniorTeamLeads) {
                    if (teamLead.higher_position === seniorTeamLead.employee_id) {
                        TeamLeadsArray.push(teamLead);
                    }
                }
            }

            for (const telecaller of Telecallers) {
                for (const teamLead of TeamLeadsArray) {
                    if (telecaller.higher_position === teamLead.employee_id) {
                        TelecallersArray.push(telecaller);
                    }
                }
            }

            TotalEmployeesArray = [...SeniorTeamLeads, ...TeamLeadsArray, ...TelecallersArray, ...data[0]]

            for (const customer of Customers) {
                for (const employee of TotalEmployeesArray) {
                    if (customer.employee_id === employee.employee_id) {
                        CustomersArray.push(customer);
                    }
                }
            }

            returnData(CustomersArray)
            break;

        case 'Senior Team Leader':
            TeamLeads = await (await Database.DB.query(`select * from employees where role = 'Team Lead' AND higher_position = '${request.params.id}'`)).rows
            Telecallers = await (await Database.DB.query(`select * from employees where role = 'Telecaller'`)).rows;
            Customers = await (await Database.DB.query(`select * from customers where branch = '${data[0].branch}'`)).rows;
    
            for(const telecaller of Telecallers){
                for(const TeamLead of TeamLeads){
                    if(telecaller.higher_position === TeamLead.employee_id){
                        TelecallersArray.push(telecaller);
                    }
                }            
            }

            TotalEmployeesArray = [ ...TeamLeads, ...TelecallersArray, ...data[0]];

            for (const customer of Customers) {
                for (const employee of TotalEmployeesArray) {
                    if (customer.employee_id === employee.employee_id) {
                        CustomersArray.push(customer);
                    }
                }
            }
    
            returnData(CustomersArray)
            break;

        case "Team Lead":
            Telecallers = await (await Database.DB.query(`select * from employees where role = 'Telecaller' where higher_position = ${data[0].employee_id}`)).rows;    
            Customers = await (await Database.DB.query(`select * from customers where branch = '${data[0].branch}'`)).rows;
            TotalEmployeesArray = [...Telecallers, ...data[0]];

            for (const customer of Customers) {
                for (const employee of TotalEmployeesArray) {
                    if (customer.employee_id === employee.employee_id) {
                        CustomersArray.push(customer);
                    }
                }
            }
    
            returnData(CustomersArray)
            break;
        case 'Telecaller':
            CustomerData = await (await Database.DB.query(`select * from customer where employee_id = '${request.params.id}'`)).rows;
            returnData(CustomerData);
            break;

        default:
            break;
    }

    response.send(responseData)
});



module.exports = {
    reportsRouter
}