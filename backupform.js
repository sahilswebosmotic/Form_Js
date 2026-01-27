validateInputs() {
    if (!this.container) {
        console.log('Form: container element not found');
    }

    if (!Array.isArray(this.formData)) {
        console.log('Form: formData must be an array');
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
loopField(field) {
    let ele;
    switch (field.type) {

        case 'text':
        case 'email':
        case 'number':
        case 'tel':
            ele = document.createElement('input');
            ele.type = field.type;
            this.initState(field, field.value || '');
            break;

        case 'textarea':
            ele = document.createElement('textarea');
            this.initState(field, field.value || '');
            break;

        case 'select':
            ele = document.createElement('select');
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.innerText = opt.innerText;
                option.value = opt.value;
                ele.appendChild(option);
            });
            this.initState(field, field.value || '');
            break;

        case 'radio':
            ele = document.createElement('div');
            this.initState(field, field.value || '');
            field.options.forEach(opt => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = field.name;
                input.value = opt.value;

                input.addEventListener('change', () => {
                    this.formState[field.name] = opt.value;
                });

                ele.appendChild(input);
                ele.appendChild(document.createTextNode(opt.innerText));
            });
            return ele;

        case 'checkbox':
            ele = document.createElement('div');
            this.formState[field.name] = [];
            field.options.forEach(opt => {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.value = opt.value;

                input.addEventListener('change', e => {
                    const arr = this.formState[field.name];
                    if (e.target.checked) {
                        arr.push(opt.value);
                    }
                    else this.formState[field.name] = arr.filter(v => v !== opt.value);
                });

                ele.appendChild(input);
                ele.appendChild(document.createTextNode(opt.innerText));
            });
            return ele;

        case 'submit':
        case 'reset':
            ele = document.createElement('button');
            ele.type = field.type;
            ele.textContent = field.value;
            break;

        default:
            return null;
    }
    this.applyAttributes(ele, field.attr || {});
    this.bindInput(ele, field);
    return ele;
}

// give the intialvalue if that is in existence
initState(field, initialValue) {
    if (this.formState[field.name] === undefined) {
        this.formState[field.name] = initialValue;
    }
}



applyAttributes(ele, attr) {
    Object.entries(attr).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
            console.log(ele[key] = value);
        } else {
            console.log(ele[key] = value);
        }
    });
}


bindInput(ele, field) {
    if (!field.name) return;
    ele.addEventListener('input', e => {
        this.formState[field.name] = e.target.value;
    });
}

getFormDataObject() {
    const data = structuredClone(this.formState);

    this.hiddenFields.forEach(field => {
        if (typeof field.getValue === 'function') {
            data[field.name] = field.getValue(data);
        }
    });

    return data;
}
bindFormSubmit() {
    this.formEl.addEventListener('submit', e => {
        e.preventDefault();

        const data = this.getFormDataObject();
        this.formEl.dispatchEvent(
            new CustomEvent('form:submit', { detail: data })
        );
        console.log(data);
    });
}