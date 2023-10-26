const db = require("../db.js").bootstrapDatabase;
const { describe } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../server.js').app;  // Adjust the path to your app's entry point

const { expect } = chai;

chai.use(chaiHttp);

describe("CI Testing for GET/healthz", () => {
    it("Successfully check the Db connection", async () => {
      let dbstatus = true;
  
      try {
  
        const response = await chai.request(app).get("/healthz");
        expect(response).to.have.status(200);
  
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