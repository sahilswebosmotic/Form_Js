export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId);
    //Container element from HTML in which you have to add form
    // Pass formContainerId to append form element inside of HTML DIV element
    // use formData to create form
    this.formData = formData;
    // form element for storing the form in the formContainerid
    // this.formEl = document.getElementById(formContainerId) ;
    // form state
    this.formState = {};
    // hidden type fields
    this.hiddenFields = [];
    // fields which are not hidden
    this.fields = [];

    document.addEventListener('updateData', (e) => {
      this.formState = { ...e.detail };
      this.editingId = e.detail.id;
      this.updateForm();
    });

    this.initialize();
  }
  // create methods/event to create form/ reset form/ submit form, etc

  // initalize the form part
  initialize() {
    this.validateInputs();
    this.saperateFormField();
    this.loopingFields();
    this.getFormDataObject();
    this.FormSubmit();
    this.FormReset();
  }
  // validation for the form data and the container in which we add the html form
  validateInputs() {
    if (!this.container) {
      console.log('Form: container element not found');
    }

    if (!Array.isArray(this.formData)) {
      console.log('Form: formData must be an array');
    }
  }

  saperateFormField() {
    this.formData.forEach((ele) => {
      if (ele.type === 'hidden') {
        this.hiddenFields.push(ele);
      } else {
        this.fields.push(ele);
      }
    });
  }

  loopingFields() {
    this.fields.forEach((field) => {
      this.loopField(field);
    });
  }

  loopField(field) {
    let ele;
    switch (field.type) {
      case 'text':
        ele = document.createElement('input');
        ele.type = field.type;
        ele.name = field.key;
        this.initState(field, field.value || '');
        break;

      case 'email':
        ele = document.createElement('input');
        ele.type = field.type;
        ele.name = field.key;
        this.initState(field, field.value || '');
        break;

      case 'number':
        ele = document.createElement('input');
        ele.type = field.type;
        ele.name = field.key;
        this.initState(field, field.value || '');

        break;

      case 'tel':
        ele = document.createElement('input');
        ele.type = field.type;
        ele.name = field.key;
        this.initState(field, field.value || '');
        break;

      case 'textarea':
        ele = document.createElement('textarea');
        ele.name = field.key;
        this.initState(field, field.value || '');
        break;

      case 'select':
        ele = document.createElement('select');
        ele.name = field.key;
        field.options.forEach((opt) => {
          const option = document.createElement('option');
          option.innerText = opt.innerText;
          option.value = opt.value;
          ele.appendChild(option);
        });
        this.initState(field, field.value || '');
        break;

      case 'checkbox':
        ele = document.createElement('div');
        ele.classList.add('checkbox_place');

        const key = field.key;
        this.formState[key] = this.formState[key] || [];

        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = field.type;
          input.name = opt.name;
          input.value = opt.value;
          input.id = opt.attr.id;
          input.className = opt.attr.className;

          input.addEventListener('change', (e) => {
            const arr = field.value;
            console.log(arr, 'initial arr');

            if (e.target.checked) {
              if (!arr.includes(opt.value)) {
                console.log('added');
                arr.push(opt.value);
                console.log(arr);
              }
            } else {
              const index = arr.indexOf(opt.value);
              if (index > -1) {
                console.log('removed');
                arr.splice(index, 1);
              }
            }
            this.formState[key] = arr;
          });

          ele.appendChild(input);
          ele.appendChild(document.createTextNode(opt.innerText));
        });
        break;

      case 'radio':
        ele = document.createElement('div');
        ele.classList.add('radio_place');
        this.formState[field.key] = field.value || '';
        field.options.forEach((opt) => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.value = opt.value;
          input.name = opt.name;
          input.id = opt.attr.id;
          input.className = opt.attr.className;
          input.required = opt.attr.required;

          input.addEventListener('change', (e) => {
            this.formState[field.key] = e.target.value;
          });

          const label = document.createElement('label');
          label.innerText = opt.innerText;
          label.htmlFor = opt.value;
          ele.appendChild(input);
          ele.appendChild(label);
        });
        break;

      case 'submit':
      case 'reset':
        ele = document.createElement('button');
        ele.type = field.type;
        ele.textContent = field.attr.value;
        break;

      default:
        break;
    }

    if (field.attr) {
      this.applyAttributes(ele, field.attr, field);
    }
    if (field) {
      this.wrappDiv(ele, field);
    }
    this.getInput(ele, field);
    return ele;
  }

  initState(field, initialValue) {
    const k = field.key || field.name;
    if (!k) return;

    if (this.formState[k] === undefined) {
      this.formState[k] = initialValue;
    }
  }

  wrappDiv(ele, field) {
    if (field.label === undefined) {
      this.container.appendChild(ele);
    } else {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.innerText = field.label;
      div.appendChild(label);
      div.appendChild(ele);
      this.container.appendChild(div);
    }
  }

  applyAttributes(ele, attr, field) {
    if (!ele || !attr) {
      return;
    } else {
      Object.entries(attr).forEach(([key, value]) => {
        if (key.startsWith('onclick') && typeof value === 'function' && key.value === 'Submit') {
          ele[key] = this.FormSubmit();
        } else if (key.value === 'Reset' && key.startsWith('onclick') && typeof value === 'function') {
          ele[key] = this.FormReset();
        } else if (key.startsWith('onchange')) {
          ele[key] = this.getInput(ele, field);
        } else {
          if (key === 'name') return;
          ele[key] = value;
        }
      });
    }
  }

  getInput(ele, field) {
    const k = field.key || field.name;
    if (!k || !ele) return;
    this.formState[k] = ele.value;
    console.log(ele.value);
  }
    // getFormDataObject() {
  //   const data = { ...this.formState };
  //   this.hiddenFields.forEach((f) => {
  //     if (typeof f.getValue === 'function') data[f.key] = f.getValue(data);
  //   });
  //   return data;
  // 

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

    // updateForm() {
  //   this.fields.forEach((field) => {
  //     const key = field.key;
  //     const value = this.formState[key];

  //     if (field.type === 'checkbox') {
  //       const checkboxes = this.container.querySelectorAll(`input[name="${key}"]`);
  //       checkboxes.forEach((cb) => {
  //         cb.checked = value.includes(cb.value);
  //       });
  //     } else if (field.type === 'radio') {
  //       const radios = this.container.querySelectorAll(`input[name="${key}"]`);
  //       radios.forEach((r) => (r.checked = r.value === value));
  //     } else {
  //       const ele = this.container.querySelector(`[name="${key}"]`);
  //       if (ele) ele.value = value;
  //     }
  //   });
  // }
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

  FormSubmit() {
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = this.getFormDataObject();

      if (this.editingId) {
        data.userId = this.editingId;
        data.mode = 'update';
      } else {
        data.mode = 'create';
      }

      const submitEvent = new CustomEvent('form:submit', {
        detail: data,
        bubbles: true,
      });

      document.dispatchEvent(submitEvent);

      this.container.reset();
      this.formState = {};
      this.editingId = null;
    });
  }

  FormReset() {
    this.container.addEventListener('reset', (e) => {
      this.formState = {};
      const data = this.formState;
      const resetEvent = new CustomEvent('form:reset', { detail: data });
      document.dispatchEvent(resetEvent);
    });
  }
}
