import formData from './data/formData.js';
import Form from './lib/form.js';
import Storage from './lib/storage.js';
import Table from './lib/table.js';

class Main {
  constructor(formContainerId, storageId, tableContainerId) {
    this.form = new Form(formContainerId, formData, {
      onSubmit: (data) => {
        if (data.userId === this.form.editingId) {
          this.storage.updateEmployeeData(data);
          this.form.showMessage('Record updated successfully!', 'success');
        } else {
          this.storage.addEmployeeData(data);
          this.form.showMessage('Record added successfully!', 'success');
        }
      },
      onReset: () => {
        console.log('Form reset');
      },
    });

    this.storage = new Storage(storageId, {
      onDataChange: (data) => {
        this.table.render(data);
      },
    });

    this.table = new Table(tableContainerId, {
      onDelete: (userId) => {
        if (this.form.editingId != null) {
          this.form.container.reset();
          this.form.formState = {};
          this.form.editingId = null;
        }
        this.storage.deleteEmployeeData(userId);
        this.form.showMessage('Record deleted successfully!', 'error');
      },
      onUpdate: (emp) => {
        this.form.updateFormData(emp);
      },
    });

    if (this.storage.getAllEmployeeData().length > 0) {
      this.table.render(this.storage.getAllEmployeeData());
    }

    window.addEventListener('storage', (e) => {
      if (e.key === storageId) {
        this.storage.employees = this.storage.loadFromStorage();
        this.table.render(this.storage.getAllEmployeeData());
      }
    });
  }
}

const main = new Main('employeeForm', 'employeeData', 'tableDiv');
