// importing required packages
const database = require('./db.js');
const express = require('express');
const app = express();

const basicAuth = require("./middleware/auth.js");
const assignment_controllers=require("./controllers/assignment_controllers.js")

app.all('/healthz', async (req, res) => {
   res.set('Cache-control', 'no-cache');
 
   try {
     const val = await database.conn();
     
     const bodyLength = parseInt(req.get('Content-Length') || '0', 10);

     if (req.method === 'GET') {
       // Checking for body and query lengths
       if (Object.keys(req.query).length > 0 || bodyLength > 0) {
         res.status(400).send(); // Bad request
       } else {
         if (!val) {
           res.status(503).send(); // Not connected
         } else {

           res.status(200).send(); // Connected
         }
       }
     } else {
       res.status(405).send(); // Method not allowed (except GET)
     }
   } catch (error) {
     // Handle the database connection error here
     console.error('Database connection error in healthz:', error);
     res.status(503).send(); // Database connection error
   }
 });

app.use(express.json())

app.post('/v1/assignments', basicAuth.basicAuth,assignment_controllers.createAssignment);
app.post('/v1/assignments/*', (req, res) => {
   res.status(400).send(); 
});
app.get('/v1/assignments', basicAuth.basicAuth,assignment_controllers.getAllAssignments);
app.get('/v1/assignments/:id',basicAuth.basicAuth, assignment_controllers.getAssignmentById);
app.put('/v1/assignments/:id',basicAuth.basicAuth, assignment_controllers.updateAssignment);
app.delete('/v1/assignments/:id',basicAuth.basicAuth, assignment_controllers.deleteAssignment);

app.all('/*', (req, res) => {
   if (req.method === 'PATCH' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      res.status(405).send();
   } else {
      res.status(404).send(); // Not found or wrong link
   }
});


app.listen(3000, (err) => {
   if (err) throw err;
   else{
      console.log(`Server is running on port `);
   }
});

module.exports={
   app
}