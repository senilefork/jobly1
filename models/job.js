"use strict";

const bodyParser = require("body-parser");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
    static async create({ title, salary, equity, company_handle }) {
        // const duplicateCheck = await db.query(
        //       `SELECT handle
        //        FROM companies
        //        WHERE handle = $1`,
        //     [handle]);
    
        // if (duplicateCheck.rows[0])
        //   throw new BadRequestError(`Duplicate company: ${handle}`);
    
        const result = await db.query(
              `INSERT INTO jobs
               (title, salary, equity, company_handle)
               VALUES ($1, $2, $3, $4)
               RETURNING title, salary, equity, company_handle`,
            [
              title,
              salary, 
              equity,
              company_handle
            ],
        );
        const job = result.rows[0];
    
        return job;
      }
    //pass a default fitler object as a parameter
    static async findAll(filterObject = {}) {
     
     const { title, minSalary, hasEquity } = filterObject

     let queryString = `SELECT jobs.title,
                        jobs.salary,
                        jobs.equity AS "hasEquity",
                        jobs.company_handle AS "companyHandle",
                        companies.name
                        FROM jobs
                        LEFT JOIN companies ON companies.handle = jobs.company_handle`
    
    //create two arrays, one for values to add to queryString and one for our values array
    let filters = [];
    let values = [];

    //if title exists push its value on to our value array and create and push our sql onto filters
    if(title !== undefined){
        values.push(`%${title}%`);
        filters.push(`title LIKE $${values.length}`);
    }

    if(minSalary !== undefined){
        values.push(minSalary);
        filters.push(`salary >= $${values.length}`)
    }

    if(hasEquity === true){
        
        filters.push(`equity > 0`)
    }

    if (filters.length !== 0) {
        filters = filters.join(" AND ")
        queryString += " WHERE " + filters;
      }

    //order by name and return results

    queryString += " ORDER BY title";
    const jobsRes = await db.query(queryString,  values);
    return jobsRes.rows;

    }

    static async get(title) {
        const jobRes = await db.query(
            `SELECT title,
             salary,
             equity,
             company_handle
             FROM jobs
             WHERE title = $1`,
            [title]);
    
        const job = jobRes.rows[0];
    
        if (!job) throw new NotFoundError(`No job: ${title}`);
    
        return job;
      }

    static async update(title, data) {
      const { setCols, values } = sqlForPartialUpdate(
          data,
          {
            companyHandle: "company_handle"
          });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE jobs 
                        SET ${setCols} 
                        WHERE title = ${handleVarIdx} 
                        RETURNING title, 
                                  salary, 
                                  equity, 
                                  company_handle AS "companyHandle"`;

      const result = await db.query(querySql, [...values, title]);
      const job = result.rows[0];

      //if (!job) throw new NotFoundError(`No job: ${title}`);

      return job;
    }
    
}

module.exports = Job;