"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {
      title: "test job 3",
      salary: 50000,
      equity: "0.000001",
      company_handle: 'c3'     
    };
  
    test("works", async function () {
      let job = await Job.create(newJob);
      expect(job).toEqual(newJob);
  
      const result = await db.query(
            `SELECT title, salary, equity, company_handle
             FROM jobs
             WHERE title = 'test job 3'`);
      expect(result.rows).toEqual([
        {
         title: "test job 3",
         salary: 50000,
         equity: "0.000001",
         company_handle: 'c3'     
        },
      ]);
     });
});

/************************************** findAll */

describe("findAll", function (){
    test("works no filter", async function () {
        let jobs = await Job.findAll();
    expect(jobs).toEqual([
        {
         title : "test job 1",
         salary: 50000,
         hasEquity: "0.00030",
         name: "C1",
         companyHandle: "c1"
        },
        {
        title : "test job 2",
        salary: 45000,
        hasEquity: "0",
        name: "C2",
        companyHandle: "c2"
        }
    ])//end toEqual
    })//end test
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
      let job = await Job.get("test job 1");
      expect(job).toEqual({
        title : "test job 1",
         salary: 50000,
         equity: "0.00030",
         company_handle: "c1"
      });
    });
  
    test("not found if no such job title", async function () {
      try {
        await Job.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** update */

  describe("update", function () {
    const updateData = {
      title: "New",
      salary: 100000,
      equity: "0.00000001",  
     companyHandle: "c1"
    };
  
    test("works", async function () {
      let job = await Job.update("test job 1", updateData);
      expect(job).toEqual({
        ...updateData,
      });
  
      const result = await db.query(
            `SELECT title, salary, equity, company_handle
             FROM jobs
             WHERE title = 'New'`);
      expect(result.rows).toEqual([{
        title: "New",
        salary: 100000,
        equity: "0.00000001",  
        company_handle: "c1"
      }]);
      
     });
  });