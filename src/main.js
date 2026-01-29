// formData is accessible here as we have global variable in formData.js
import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId) {
    // formContainerId, storageId, tableContainerId will be in argument of constructor
    // start code to init and link form.js, storage.js, table.js
    const frm = new Form(formContainerId, formData); // form js class to create form and access its methods
    const storage = new Storage(storageId); // storage class to access storage methods
    const tbl = new Table(tableContainerId); // table js class to create table and access its methods
    // console.log(formData, frm, storage, tbl, 'Printed all instance of the class to remove eslint error');

    // Listen the event for form submission
    document.addEventListener('form:submit', (e) => {
      // now giving this event to the storage for the storing the data in the local storage
      const storeEvent = new CustomEvent('storeData', { detail: e.detail });
      document.dispatchEvent(storeEvent);
    });

    document.addEventListener('SendData', (e) => {
      const showData_Table = new CustomEvent('table:render', { detail: e.detail });
      document.dispatchEvent(showData_Table);
    });

    // this is for showing all the records
    if (storage.getAll().length > 0) {
      const table_render = new CustomEvent('table:render', { detail: storage.getAll() });
      document.dispatchEvent(table_render);
    }

    document.addEventListener('delete_record', (e) => {
      const recordId = e.detail;
      if (frm.editingId === recordId) {
        frm.container.reset();
        frm.formState = {};
        frm.editingId = null;
      }
      
      const delete_record = new CustomEvent('deleteData', { detail: recordId });
      document.dispatchEvent(delete_record);
    });

    document.addEventListener('update_record', (e) => {
      const emp = e.detail;
      frm.editingId = emp.id;
      const update_record = new CustomEvent('updateData', { detail: emp });
      document.dispatchEvent(update_record);
    });

    document.addEventListener('form:reset', (e) => {
      console.log('form reset');
    });

    window.addEventListener('storage', (e) => {
      if (e.key === storageId) {
        const updatedData = storage.loadFromStorage();
        const syncEvent = new CustomEvent('table:render', { detail: updatedData });
        document.dispatchEvent(syncEvent);
      }
    });
  }
}
//formContainerId: HTML Div element id inside of which you want to create form4
// formContainerId -> #employeeForm of current index.html

// storageId: localStorage key for saving json  string data init
// storageId -> 'employeeData' simple string to selected as key of localStorage

//tableContainerId: HTML Div element id inside of which you want to create table
// tableContainerId -> #tableDiv of current index.html

//pass formContainerId, storageId, tableContainerId to Main(formContainerId, storageId, tableContainerId)
// const main = new Main('formContainerId', 'storageId', 'tableContainerId');
const main = new Main('employeeForm', 'employeeData', 'tableDiv');
// console.log(main);


