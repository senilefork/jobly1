const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/*This function takes two objects as parameters
  one object containing the information that we want to update and another 
  object containing sql versions of javascript variables that we may 
  be using in our models for making db queries */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  //take the keys of the dataToUpdate object and put the keys into an array
  const keys = Object.keys(dataToUpdate);
  //make sure we're passing data
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
  //loops through our keys array and if our jsToSql obj contains that key as a value then
  //use that sql value, otherwise we are looking at a valid sql value and increment our index
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
//return an obj containing our sql cols seperated by a comma and the values of the data we want to update
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
