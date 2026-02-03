export default class Table {
  constructor(tableContainerId,callbacks={}) {
    this.container = document.getElementById(tableContainerId); 

    this.onUpdate = callbacks.onUpdate || (()=>{});
    this.onDelete = callbacks.onDelete || (()=>{});
  }

  formatHeaderName(key) {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
    const up_div = document.createElement('div');
    const count = document.createElement('h3');
    count.innerText = `Total Items : ${data.length}`
    up_div.appendChild(count);

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const firstRow = data[0];
    const headers = Object.keys(firstRow).filter(key => key !== 'id' && key !== 'userId' && key !== 'createdAt');

    headers.forEach((key) => {
      const th = document.createElement('th');
      th.innerText = this.formatHeaderName(key);
      headerRow.appendChild(th);
    });

    const thaction = document.createElement('th');
    thaction.innerText = 'Action';
    thaction.classList.add('basic-view-action');
    headerRow.appendChild(thaction);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach((emp) => {
      const row = document.createElement('tr');
      headers.forEach((header)=>{
        const td = document.createElement('td');
        td.innerText = emp[header];
        if(!emp[header]){
          td.innerText = ' - ';
        }
        row.appendChild(td);
      });
      
      const td = document.createElement('td');
      
      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';
      del_btn.classList.add('del_btn')
      del_btn.addEventListener('click',(e)=>{
        const id = emp.userId;
        this.onDelete(id);
      })
      
      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('up_btn');
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
    container.appendChild(up_div);
    container.appendChild(table);
  }
}
