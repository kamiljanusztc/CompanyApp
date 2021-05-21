const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require("mongoose");

describe('Employee', () => {

  it('should throw an error if no "firstName", "lastName" or "department" arg', () => {
    const emp = new Employee({}); 
  
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  
  });

  it('should not throw an error if "firstName", "lastName" or "department" is missing', () => {

    const emp1 = { firstName: "Amanda", lastName: "Doe" };
    const emp2 = { firstName: "Amanda", department: "Marketing" };
    const emp3 = { lastName: "Doe", department: "Marketing" };
    const emp4 = { firstName: "Amanda" };
    const emp5 = { lastName: "Doe" };
    const emp6 = { department: "Marketing" };

    const cases = [ emp1, emp2, emp3, emp4, emp5, emp6 ];
    for(let example of cases) {
      const emp = new Employee( example );
  
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
  
    }
  
  });

  it('should throw an error if "firstName", "lastName" or "department" is not a string', () => {

    const emp1 = { firstName: {} };
    const emp2 = { firstName: [] };
    const emp3 = { lastName: {} };
    const emp4 = { lastName: [] };
    const emp5 = { department: {} };
    const emp6 = { department: [] };

    const cases = [ emp1, emp2, emp3, emp4, emp5, emp6 ];
    for(let example of cases) {
      const emp = new Employee( example );
  
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
  
    }
  
  });

  it('should not throw an error if "firstName", "lastName" and "department" is okay', () => {

    const emp1 = { firstName: "Amanda", lastName: "Doe", department: "Marketing" };
    const emp2 = { firstName: "Jonathan", lastName: "Wilson", department: "IT" };

    const cases = [ emp1, emp2 ];
    for(let example of cases) {
      const emp = new Employee( example );
  
      emp.validate(err => {
        expect(err).to.not.exist;
      });
  
    }
  
  });

});

