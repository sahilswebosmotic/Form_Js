export default class Storage {
  constructor(storageId) {
    this.storageId = storageId; // use this.storageId with localStorage as a unique key to store data
    // Pass storageId to save json string data after each operation in localStorage
    // local storageId is important to retrieve old saved data
    this.employees = this.loadFromStorage();

      document.addEventListener('storeData', (e) => {
      const data = e.detail;
        if(data.mode==='update'){
          const findIndex = this.employees.findIndex((emp)=> emp.id === data.id);
            this.employees[findIndex] = data;
            this.saveToStorage();
        }else{
          this.add(e.detail);
        }
      const sendEvent = new CustomEvent('SendData', { detail: this.employees });
      document.dispatchEvent(sendEvent);
    });


    document.addEventListener('deleteData', (e) => {
      this.delete(e.detail);

      const sendEvent = new CustomEvent('SendData', { detail: this.employees });
      document.dispatchEvent(sendEvent);
    });
  }

  loadFromStorage() {
    const data = localStorage.getItem(this.storageId);
    return data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    localStorage.setItem(this.storageId, JSON.stringify(this.employees));
  }
  // create methods to perform operations like save/edit/delete/add data
  getAll() {
    return [...this.employees];
  }

  add(record) {
    record.id = Date.now(); // unique id
    this.employees.push(record);
    this.saveToStorage();
  }

  delete(id) {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    this.saveToStorage();
  }
}
