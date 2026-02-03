export default class Form {
  constructor(formContainerId, formData , callbacks={}) {
    this.container = document.getElementById(formContainerId);
    this.formData = formData;
    this.hiddenFields = [];
    this.fields = [];
    this.editingId = null;

    this.onSubmit = callbacks.onSubmit || (() => { });
    this.onReset = callbacks.onReset || (() => { });
    this.initialize();
  }

  initialize() {
    this.validateInputs();
    this.separateFormField();
    this.loopingAllInputFields();
    this.FormSubmit();
    this.FormReset();
  }

  validateInputs() {
    if (!this.container) console.log('Form container not found');
    if (!Array.isArray(this.formData)) console.log('formData must be array');
  }

  separateFormField() {
    this.formData.forEach((f) => (f.type === 'hidden' ? this.hiddenFields.push(f) : this.fields.push(f)));
  }

  loopingAllInputFields() {
    this.fields.forEach((field) => this.loopOnInputField(field));
  }

  loopOnInputField(field) {
    let ele;
    const key = field.key;

    switch (field.type) {

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
        const checkboxes = [];
        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = key;
          input.value = opt.value;
          input.id = opt.attr.id;
          input.className = opt.attr.className;
          checkboxes.push(input);
          ele.appendChild(input);
          const label = document.createElement('label');
          label.classList.add('radio_check_label');
          label.innerText = opt.innerText;
          label.value = opt.value;
          label.htmlFor = opt.attr.id;
          ele.appendChild(label);
        });

        break;

      case 'radio':
        ele = document.createElement('div');
        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = key;
          input.value = opt.value;
          input.id = opt.attr.id;
          input.className = opt.attr.className;
          const label = document.createElement('label');
          label.classList.add('radio_check_label');
          label.innerText = opt.innerText;
          label.value = opt.value;
          label.htmlFor = opt.attr.id;
          ele.appendChild(input);
          ele.appendChild(label); 
        });

        break;

      case 'submit':
      case 'reset':
        ele = document.createElement('button');
        ele.type = field.type;
        ele.textContent = field.attr.value;
        this.applyAttributes(ele,field.attr);
        break;

        default :
        ele = document.createElement('input');
        ele.type = field.type;
        ele.name = key;
        this.applyAttributes(ele, field.attr);
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

        default:{          
          ele.value = value;
          break;
        }
      }
    });
  }


  applyAttributes(element, attr) {
    if (!attr) return;
    if(!attr.className){
       element.className = 'default_input';
    }

    Object.keys(attr).forEach((key) => {
      const value = attr[key];

      if (typeof value === 'function' || key === 'name') return;
      if (key === 'className') {
        element.className = value;
      }else if (key === 'required' && value === true) {
        element.setAttribute('required', 'true');
      } else if(key==='required' && value === false){
        element.removeAttribute('required','');
      }else {
        element.setAttribute(key, value);
      }
    });
  }

  getFormDataObject() {
    const formDataObject = new FormData(this.container);
    const data = {};


    this.fields.forEach((field) => {
      const key = field.key;

      if (field.type === 'checkbox') {
        data[key] = formDataObject.getAll(key);
      } else if (field.type !== 'submit' && field.type !== 'reset') {
        data[key] = formDataObject.get(key) || '';
      }
    });


    this.hiddenFields.forEach((field) => {
      if (typeof field.getValue === 'function') {
        data[field.key] = field.getValue(data);
      }
    });

    return data;
  }


  FormSubmit() {
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = this.getFormDataObject();
      if (this.editingId) {
        data.userId = this.editingId;
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
    this.editingId = data.userId;
    this.updateForm(data);
  }

  showMessage(message, type = 'success') {
    const existingMsg = this.container.parentElement.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message form-message-${type}`;
    msgDiv.textContent = message;
    this.container.appendChild(msgDiv);

    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  }
}
