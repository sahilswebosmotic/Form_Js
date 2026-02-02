
import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId, callbacks = {}) {

    this.form = new Form(formContainerId, formData, {
      onSubmit: (data) => {
        if (data.id) {
          this.storage.update(data);
          this.form.showMessage('Record updated successfully!', 'success');
        }
        else {
          this.storage.add(data);
          this.form.showMessage('Record added successfully!', 'success');
        }
      },
      onReset: () => {
        console.log('Form reset');
      }
    });


    this.storage = new Storage(storageId, {
      onDataChange: (data) => {
        this.table.render(data);
      }
    });

    this.table = new Table(tableContainerId, {
      onDelete: (id) => {
        if (this.form.editingId === id) {
          this.form.container.reset();
          this.form.formState = {};
          this.form.editingId = null;
        }
        this.storage.delete(id);
        this.form.showMessage('Record deleted successfully!', 'error');
      },
      onUpdate: (emp) => {
        this.form.updateFormData(emp);

      }
    });


    if (this.storage.getAll().length > 0) {
      this.table.render(this.storage.getAll());
    }

    window.addEventListener('storage', (e) => {
      if (e.key === storageId) {
        const updatedData = this.storage.loadFromStorage();
        this.table.render(updatedData);
      }
    });
  }
}

const main = new Main('employeeForm', 'employeeData', 'tableDiv');



