export default class Table {
  constructor(tableContainerId,callbacks={}) {
    this.container = document.getElementById(tableContainerId); 

    this.onUpdate = callbacks.onUpdate || (()=>{});
    this.onDelete = callbacks.onDelete || (()=>{});
  }

  render(data) {
    const container = this.container;
    const tableSection = document.querySelector('.tableSection');
    container.innerHTML = '';
    
    if(!container) {
      console.log('Table: container element not found');
      return;
    }

    if(!data || !Array.isArray(data) || data.length === 0) {
      if(tableSection) {
        tableSection.style.display = 'none';
      }
      return;
    }

    if(tableSection) {
      tableSection.style.display = 'block';
    }
    
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Name', 'Email', 'Phone', 'Address','Street-Address', 'City', 'State','Pincode', 'Country','Gender','Hobbies'];

    headers.forEach((header) => {
      const th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });

    const thaction = document.createElement('th');
    thaction.innerText = 'Action';
    thaction.classList.add('basic-view-action');
    headerRow.appendChild(thaction);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach((emp,id) => {
      const row = document.createElement('tr');

      [
        emp.name,
        emp.email,
        emp.phone,
        emp.address,
        emp.street_address,
        emp.city,
        emp.state,
        emp.pin_code,
        emp.country,
        emp.gender,
        Array.isArray(emp.hobbies) ? emp.hobbies.join(', ') : (emp.hobbies || ''),
      ].forEach((value) => {
        const td = document.createElement('td');
        td.innerText = value;
        if(!value){
          td.innerText = ' - ';
        }
        row.appendChild(td);
      });
      const td = document.createElement('td');

      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';

      del_btn.addEventListener('click',(e)=>{
        const id = emp.id;
        this.onDelete(id);
      })
      
      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.addEventListener('click',(e)=>{
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        this.onUpdate(emp); 
      })
      td.appendChild(del_btn);
      td.appendChild(up_btn);
      row.appendChild(td);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }
}
