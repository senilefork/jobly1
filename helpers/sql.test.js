const {sqlForPartialUpdate} = require("./sql")


describe("sqlForPartialUpdate", function () {
    test("works", function () {
      const data = { username: "test user", testValue: "some value"}
      const jsSql = { testValue: "test_value" }
      const d = sqlForPartialUpdate(data, jsSql)
      expect(d).toEqual({
       setCols: "\"username\"=$1, \"test_value\"=$2",
       values: ["test user", "some value"]
      });
    })
})