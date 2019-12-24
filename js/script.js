 // http://jsonplaceholder.typicode.com/users

const url = 'http://jsonplaceholder.typicode.com/users';
const tb = document.querySelector('#users-table tbody');
const totalEl = document.getElementById('total-users')

const arr = [];

localStorage.getItem('users') ? 
 render(JSON.parse(localStorage.getItem('users')))
 : getUsers(url);

function getUsers(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('users', JSON.stringify(data));
        render(data);
    })
}


function render(users) {
  tb.innerHTML = users.map(user => `<tr>
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.username}</td>
    <td><i data-id="${user.id}"  data-action="show-confirm" class="action-user fas fa-trash"></i></td>
  </tr>`).join('')
  totalEl.textContent = users.length;
}

function removeElement(id) {
    const removedEl = document.getElementById(id)
    removedEl.parentNode.removeChild(removedEl);
}
function isRenderConfirm(){
    return document.getElementById('confirm-box')
}


function renderConfirm(x, y, id) {
    if(isRenderConfirm()) {
        removeElement('confirm-box');
    }
    const div = document.createElement('div')
    div.id  = 'confirm-box'
    div.className  = 'confirm-box'
    div.innerHTML = `<button data-action="delete-user" data-id="${id}" class="action-user delete-btn btn btn-primary btn-sm">OK</button>
    <button data-action="hide-confirm" class="action-user cancel-btn btn btn-danger btn-sm">Cancel</button>`;
    document.querySelector('body').appendChild(div);
    
    div.style.top = y - div.offsetHeight / 2 + 'px'
    div.style.left = x - div.offsetWidth - 30 + 'px'
}


function handleUser(e) {
    const target = e.target;
    if(!target.classList.contains('action-user')) {
        if(isRenderConfirm()) {
            removeElement('confirm-box');
        }    
        return false;
    }
    const id = Number(target.dataset.id);

    switch(target.dataset.action) {
        case "show-confirm": 
            const {left, top} = target.getBoundingClientRect();

            const  x = left + window.pageXOffset;
            const  y =  top +  window.pageYOffset / 2;
            
            renderConfirm(e.clientX, e.clientY, id);
            break;
        case 'hide-confirm':
              removeElement('confirm-box');   
              break;
        case 'delete-user':
            let users  = JSON.parse(localStorage.getItem('users'))
            arr.push(users); 
            users = users.filter(u => u.id !== id)
            localStorage.setItem('users', JSON.stringify(users))
            render(users);
            removeElement('confirm-box');
            break;  
        case 'update-cache': 
            getUsers(url);
            break;  
        case 'undo':
           render(arr.pop());
           break;            
    }
}

document.addEventListener('click', handleUser)
document.addEventListener('keyup', function(e){
    const target = e.target;
    if(target.id !== 'filter'){
        return;
    }
    const val = target.value;
    let users  = JSON.parse(localStorage.getItem('users')) 
    users = users.filter(u => u.name.toLowerCase().includes(val.toLowerCase()))
    render(users);
    
})
