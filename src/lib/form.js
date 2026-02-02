export default class Form {
  constructor(formContainerId, formData , callbacks={}) {
    this.container = document.getElementById(formContainerId);
    this.formData = formData;
    this.hiddenFields = [];
    this.fields = [];
    this.editingId = null;

    this.onSubmit = callbacks.onSubmit || (() => { });
    this.onReset = callbacks.onReset || (() => { });
    this.onUpdate = callbacks.onUpdate || (() => { });


    this.initialize();
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
        this.applyAttributes(ele, field.attr);
        break;

      case 'textarea':
        ele = document.createElement('textarea');
        ele.name = key;

        this.applyAttributes(ele, field.attr);
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

        this.applyAttributes(ele, field.attr);
        break;

      case 'checkbox':
        ele = document.createElement('div');
        ele.classList.add('checkbox_place');
        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = key;
          input.value = opt.value;
          this.applyAttributes(ele, field.attr);

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
          this.applyAttributes(ele, field.attr);

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


  updateForm(data) {
    this.fields.forEach((field) => {
      const value = data[field.key];
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



  applyAttributes(element, attr) {
    if (!attr) return;

    Object.keys(attr).forEach((key) => {
      const value = attr[key];

      if (typeof value === 'function' || key === 'name') return;

      if (key === 'className') {
        element.className = value;
      } else if (key === 'required' && value === true) {
        element.setAttribute('required', '');
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  getFormDataObject() {
    const formData = new FormData(this.container);
    const data = {};


    this.fields.forEach((field) => {
      const key = field.key;

      if (field.type === 'checkbox') {

        data[key] = formData.getAll(key);
      } else if (field.type !== 'submit' && field.type !== 'reset') {

        data[key] = formData.get(key) || '';
      }
    });


    this.hiddenFields.forEach((field) => {
      if (typeof field.getValue === 'function') {
        data[field.key] = field.getValue(data);
      }
    });

    console.log(data);
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

      this.onSubmit(data);

      this.container.reset();

      this.editingId = null;
    });
  }

  FormReset() {
    this.container.addEventListener('reset', () => {
      this.editingId = null;
      this.onReset();
    });
  }

  updateFormData(data) {
    this.editingId = data.id;
    this.updateForm(data);
  }

  showMessage(message, type = 'success') {
    const existingMsg = this.container.parentElement.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message form-message-${type}`;
    msgDiv.textContent = message;

    this.container.parentElement.insertBefore(msgDiv, this.container.nextSibling);

    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  }
}
