export default class Storage {
  constructor(storageId,callbacks={}) {
    this.storageId = storageId; 
    this.employees = this.loadFromStorage();
    this.onDataChange = callbacks.onDataChange || (() => { });  
  }

  loadFromStorage() {
    const data = localStorage.getItem(this.storageId);
    return data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    localStorage.setItem(this.storageId, JSON.stringify(this.employees));
  }

  getAllEmployeeData() {
    return [...this.employees];
  }

  addEmployeeData(employeeData) {
    this.employees.push(employeeData);
    this.saveToStorage();
    this.onDataChange(this.getAllEmployeeData());
  }

  deleteEmployeeData(userId) {
    this.employees = this.employees.filter((emp) => emp.userId !== userId);
    this.saveToStorage();
    this.onDataChange(this.getAllEmployeeData());
  }

  updateEmployeeData(employeeData) {
    const index = this.employees.findIndex((emp) => emp.userId === employeeData.userId);
    if (index > -1) {
      this.employees[index] = employeeData;
      this.saveToStorage();
      this.onDataChange(this.getAllEmployeeData());
    }
  }
}
