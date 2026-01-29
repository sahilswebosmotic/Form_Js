export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId);
    this.formData = formData;
    this.formState = {};
    this.hiddenFields = [];
    this.fields = [];
    this.editingId = null;

    document.addEventListener('updateData', (e) => {
      this.formState = { ...e.detail };
      this.editingId = e.detail.id;
      this.updateForm();
    });

    this.initialize();
    this.resetFormState();
  }

  initialize() {
    this.validateInputs();
    this.saperateFormField();
    this.loopingFields();
    this.FormSubmit();
    this.FormReset();
  }

  validateInputs() {
    if (!this.container) console.log('Form container not found');
    if (!Array.isArray(this.formData)) console.log('formData must be array');
  }

  saperateFormField() {
    this.formData.forEach((f) => (f.type === 'hidden' ? this.hiddenFields.push(f) : this.fields.push(f)));
  }

  loopingFields() {
    this.fields.forEach((field) => this.loopField(field));
  }

  loopField(field) {
    let ele;
    const key = field.key;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        ele = document.createElement('input');
        ele.type = field.type;
        ele.name = key;
        ele.addEventListener('input', (e) => {
          this.formState[key] = e.target.value;
        });
        break;

      case 'textarea':
        ele = document.createElement('textarea');
        ele.name = key;
        ele.addEventListener('input', (e) => {
          this.formState[key] = e.target.value;
        });
        break;

      case 'select':
        ele = document.createElement('select');
        ele.name = key;
        field.options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.innerText = opt.innerText;
          ele.appendChild(option);
        });
        ele.addEventListener('change', (e) => {
          this.formState[key] = e.target.value;
        });
        break;

      case 'checkbox':
        ele = document.createElement('div');
        ele.classList.add('checkbox_place');
        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = key;
          input.value = opt.value;

          input.addEventListener('change', (e) => {
            const arr = this.formState[key] || (this.formState[key] = []);
            if (e.target.checked) {
              if (!arr.includes(opt.value)) arr.push(opt.value);
            } else {
              this.formState[key] = arr.filter((v) => v !== opt.value);
            }
          });

          ele.appendChild(input);
          ele.appendChild(document.createTextNode(opt.innerText));
        });
        break;

      case 'radio':
        ele = document.createElement('div');
        ele.classList.add('radio_place');
        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = key;
          input.value = opt.value;

          input.addEventListener('change', (e) => {
            this.formState[key] = e.target.value;
          });

          ele.appendChild(input);
          ele.appendChild(document.createTextNode(opt.innerText));
        });
        break;

      case 'submit':
      case 'reset':
        ele = document.createElement('button');
        ele.type = field.type;
        ele.textContent = field.attr.value;
        break;
    }

    if (field.label) {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.innerText = field.label;
      div.appendChild(label);
      div.appendChild(ele);
      this.container.appendChild(div);
    } else {
      this.container.appendChild(ele);
    }
  }

  resetFormState() {
    this.formState = {};
    this.fields.forEach((field) => {
      const key = field.key;
      if (field.type === 'checkbox'){
        this.formState[key] = [];
      }
      else if (field.type !== 'submit' && field.type !== 'reset') {
        this.formState[key] = '';
      } 
    });
  }

  updateForm() {
    this.fields.forEach((field) => {
      const value = this.formState[field.key];
      if (value === undefined) return;

      const ele = this.container.querySelector(`[name="${field.key}"]`);
      if (!ele) return;

      switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'tel':
        case 'textarea':
          ele.value = value;
          break;

        case 'select':
          ele.value = value;
          break;

        case 'checkbox': {
          console.log('updating checkbox');
          const checkboxes = this.container.querySelectorAll(`input[name="${field.key}"]`);
          console.log(checkboxes);
          checkboxes.forEach((cb) => {
            const formValue = Array.isArray(value) ? value : [];
            cb.checked = formValue.includes(cb.value);
          });

          break;
        }

        case 'radio': {
          const radios = this.container.querySelectorAll(`input[name="${field.key}"]`);
          radios.forEach((r) => {
            r.checked = r.value === value;
          });
          break;
        }
      }
    });
  }

  getFormDataObject() {
    const data = this.formState;
    this.hiddenFields.forEach((field) => {
      if (typeof field.getValue === 'function') {
        data[field.key] = field.getValue(data);
      } else {
        console.log("don't add any element ");
      }
    });
    return data;
  }


  FormSubmit() {
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = this.getFormDataObject();

      if (this.editingId) {
        data.id = this.editingId;
        data.mode = 'update';
      } else {
        data.mode = 'create';
      }

      document.dispatchEvent(new CustomEvent('form:submit', { detail: data }));

      this.container.reset();
      this.resetFormState();
      this.editingId = null;
    });
  }

  FormReset() {
    this.container.addEventListener('reset', () => {
      this.resetFormState();
      document.dispatchEvent(new CustomEvent('form:reset'));
    });
  }
}
