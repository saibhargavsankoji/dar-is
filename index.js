const express = require("express");
const App = express();
const path = require('path');
const Database = require('./Helper/database');
const cors = require('cors');
const { router } = require('./Routes/employee_routes');
const { branchRouter } = require('./Routes/branch_route');
const { designationRouter } = require('./Routes/designation_route');

const client = Database.DB;

Database.Connect();

App.use(express.json());
App.use(cors());
App.use('/api/employee', router);
App.use('/api/branch', branchRouter);
App.use('/api/designation', designationRouter);

// App.use(express.static('public'));
App.use(express.static(path.join(__dirname, 'public')));

App.listen(process.env.PORT || 1998, function () {
  console.log(`Application listening on ${process.env.PORT || 1998}`);
});

App.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = client;