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

  getAll() {
    return [...this.employees];
  }

  add(record) {
    record.id = Date.now();
    this.employees.push(record);
    this.saveToStorage();
    this.onDataChange(this.getAll());
  }

  delete(id) {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    this.saveToStorage();
    this.onDataChange(this.getAll());
  }

  update(record) {
    const index = this.employees.findIndex((emp) => emp.id === record.id);
    if (index > -1) {
      this.employees[index] = record;
      this.saveToStorage();
      this.onDataChange(this.getAll());
    }
  }
}
