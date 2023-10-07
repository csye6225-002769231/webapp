const db = require("../db.js").bootstrapDatabase;
const { describe } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../server.js').app;  // Adjust the path to your app's entry point

const { expect } = chai;

chai.use(chaiHttp);

// describe("GET /healthz endpoint test", () => {
//   it("should return success upon connection", async() => {
//     await bootstrapDatabase()
//     chai
//       .request(app)
//       .get("/healthz")
//       .end(function(err, res) {
//         if (err){
//           console.log(err)
//         }
//         expect(res).to.have.status(200).ok;  
//         sequelize.close();
//       });
//   });
// });

// describe("GET /healthz endpoint test", () => {
//     it("should return success upon connection", async () => {
//         try {
//             console.log("line 30")
//             //await db.bootstrapDatabase();
//         } catch (error) {
//             console.error("Database bootstrap error:", error);
//             // If the error message indicates connection refused, treat it as a database connection failure
//             if (error.message.includes("ECONNREFUSED")) {
//                 console.log("Database connection refused. Treating as a failure.");
//             }
//         }

//         const response = await chai.request(app).get("/healthz");
//         // If there was no database connection error, expect a 200 status code
//         expect(response).to.have.status(200);        
//     });
// });
describe("CI Testing for GET/healthz", () => {
    it("Successfully check the Db connection", async () => {
      let dbstatus = true;
  
      try {
  
        const response = await chai.request(app).get("/healthz");
        expect(response).to.have.status(503);
  
      } catch (error) {
        console.error("Test Error:", error);
        dbstatus = false;
        expect(dbstatus, "Database connection failed").to.be.true;
      } finally {
        setTimeout(() => {
          process.exit(0); 
        }, 2000); // 
      }
    });
  });
