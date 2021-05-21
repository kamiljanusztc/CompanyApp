const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => { 

  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();
  
      const uri = await fakeDB.getConnectionString();
  
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    } catch(err) {
      console.log(err);
    }
  
  });

  after(() => {
    mongoose.models = {};
  });

  describe('Reading data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'IT' });
      await testEmpTwo.save();
    });
  
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda' });
      const expectedFirstName = 'Amanda';
      expect(employee.firstName).to.be.equal(expectedFirstName);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'IT' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method,', async () => {
      await Employee.updateOne({ firstName: 'Amanda' }, { $set: { department: 'IT' }});
      const updatedEmployee = await Employee.findOne({ department: 'IT' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      employee.firstName = 'Joanna';
      employee.lastName = 'Diaz';
      employee.department = 'IT';
      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: 'Joanna', lastName: 'Diaz', department: 'IT' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { department: 'Service' }});
      const employees = await Employee.find();
      expect(employees[0].department).to.be.equal('Service');
      expect(employees[1].department).to.be.equal('Service');
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'IT' });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      const deletedEmployee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

});