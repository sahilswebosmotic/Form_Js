export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId); //Container element from HTML in which you have to add form
    // Pass formContainerId to append form element inside of HTML DIV element
    // use formData to create form
    this.formData = formData;
    this.formE1 = null;
    this.formState ={};
    this.hiddenFields = [];
    this.fields= [];

    this.initialize();
    console.log('Form', formData);
  }
  // create methods/event to create form/ reset form/ submit form, etc

  // initalize the form part
  initialize(){
    this.validateInputs();
    this.saperateFormField();
    this.createForm();
    this.loopingFields();
    this.bindFormSubmit();
  } 
    // validation for the form data and the container in which we add the html form
    validateInputs() {
    if (!this.container) {
      throw new Error('Form: container element not found');
    }

    if (!Array.isArray(this.formData)) {
      throw new Error('Form: formData must be an array');
    }
  }
  // saperate the hidden input form field
    saperateFormField() {
    this.formData.forEach(field => {
      if (field.type === 'hidden') {
        this.hiddenFields.push(field);
      } else {
        this.fields.push(field);
      }
    });
  }

  // create the form element based on the formdata
  createForm() {
    this.formEl = document.createElement('form');
    this.formEl.noValidate = false;
    this.container.appendChild(this.formEl);
  }

  // loop through each field so that add the formdata field into the form element which is created
  loopingFields() {
    this.fields.forEach(field => {
      const el = this.loopField(field);
      if (el) this.formEl.appendChild(el);
    });
  }

  // loop by each input field and adding values saperately
  loopField(field){
    let ele;
    switch(field.type){
      case text:
      case email:
      case number:
      case tel:
         ele = document.createElement('input');
        ele.type = field.type;
        this.initState(field, field.value || '');
        break;
    }
  }

// give the intialvalue if that is in existence
    initState(field, initialValue) {
    if (this.formState[field.name] === undefined) {
      this.formState[field.name] = initialValue;
    }
  }

}
