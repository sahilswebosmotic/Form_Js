export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId);
    document.addEventListener('table:render', (e) => {     
      this.render_Basic_Employee_Table(e.detail);
    })  
  }

  render_Basic_Employee_Table(data) {
    const container = this.container;
    const tableSection = document.querySelector('.tableSection');
    container.innerHTML = '';
    
    if(!container) {
      console.log('Table: container element not found');
      return;
    }

    // Check if data exists and has at least 1 record
    if(!data || !Array.isArray(data) || data.length === 0) {
      if(tableSection) {
        tableSection.style.display = 'none';
      }
      return;
    }

    // Show table section when records exist
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

    data.forEach((emp, id) => {
      const row = document.createElement('tr');
      
      // Handle hobbies properly
      let hobbiesText = '';
      if (Array.isArray(emp.hobbies) && emp.hobbies.length > 0) {
        hobbiesText = emp.hobbies.join(', ');
      } else if (typeof emp.hobbies === 'string' && emp.hobbies.trim()) {
        hobbiesText = emp.hobbies;
      } else {
        hobbiesText = ' - ';
      }
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
        hobbiesText,
      ].forEach((value) => {
        const td = document.createElement('td');
        td.innerText = value || ' - ';
        row.appendChild(td);
      });

      const td = document.createElement('td');

      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';
      del_btn.classList.add('delete-btn');

      del_btn.addEventListener('click', (e) => {
        const id = emp.id;
        const delete_record = new CustomEvent('delete_record', {detail: id});
        document.dispatchEvent(delete_record);
      });
      
      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('update-btn');

      up_btn.addEventListener('click', (e) => {
        const update_record = new CustomEvent('update_record', {detail: emp});
        document.dispatchEvent(update_record);
      });

      td.appendChild(del_btn);
      td.appendChild(up_btn);
      row.appendChild(td);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }
}