// task todo-list

/*
- Создать приложение TODO-list для хранения списка задач:
    1. Получить все задачи из json-файла;
        - Задача имеет поля: title, description, priority, status;
    2. Выводить список задач в виде карточек;
    3. Добавить возможность создавать, редактировать и удалять задачи;
    4. Менять задачам статус (Open, In progress, Done);
    5. Менять приоритет задач (Low, Minor, Major, High);
    6. Данные по всем задачам хранить в localStorage;
    7. Если localStorage не пустой - показывать список задач оттуда, 
    в противном случае - отправлять запрос на json-файл.
*/
const newArr = [];
function loadData() {
    return fetch('./json/db.json').then(res => res.json());
}

if (!localStorage.getItem('todoItems')) {
    loadData().then(todoItems => {
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        for(let elem of todoItems){
            newArr.push(elem)
        }
        renderTodoItems(todoItems);
    });
} else {
    const todoItems = JSON.parse(localStorage.getItem('todoItems'));
    for(let elem of todoItems){
        newArr.push(elem)
    }
    renderTodoItems(todoItems);
}

function renderTodoItems(todoItems) {
    const parent = document.getElementById('cards');

    todoItems.forEach(item => {
        renderCard(item, parent);
    });
}

function renderCard(item, parent) {
    const cardTemplate = `
        <div class="card">
        <div class="title__wrap">
            <div class="title">${item.title}</div>
            <input class="edit__title" placeholder="Your title..." id="${item.id}-${item.title}"></input>
            <div class="options">
                <div class="priority">
                    <select id="priority${item.id}">
                        <option value="set">${item.priority}</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div class="status">
                    <select id="status${item.id}">
                        <option value="set">${item.status}</option>
                        <option value="Todo">Todo</option>
                        <option value="In progress">In progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="description">${item.description}</div>
        <textarea class="textarea__new" placeholder="Your note..." id="${item.title}-${item.id}"></textarea>
        <div class="controls" id="${item.id}">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;
    parent.innerHTML += cardTemplate;
}

function renderFormNote() {
    const formNodeTemp = `
    <div class="add__card">
        <div class="title__wrap">
            <input class="input__title" placeholder="Your title..." minlength="1"></input>
            <div class="options">
                <div class="priority">
                    <select id="priority">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div class="status">
                    <select id="status">
                        <option value="Todo">Todo</option>
                        <option value="In progress">In progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
            </div>
        </div>
        <textarea class="textarea" placeholder="Your note..."></textarea>
        <div class="controls">
            <button class="save">Save</button>
        </div>
    </div> 
    `;
    const parent = document.getElementById('cards');
    parent.innerHTML += formNodeTemp;
}

const btnPlus = document.querySelector('.addlist');
btnPlus.addEventListener('click', () => {
    renderFormNote();
    btnPlus.style.display = 'none';
});

function upDateCards() {
    deleteAllCards();
    const todoItems = JSON.parse(localStorage.getItem('todoItems'));
    renderTodoItems(todoItems);
    btnPlus.style.display = 'flex';
}

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('save')){
        let num = (newArr.length + 1).toString();
        const inputTitle = document.querySelector('.input__title').value;
        const textarea = document.querySelector('.textarea').value;
        const priority = document.getElementById('priority').value;
        const status = document.getElementById('status').value;
        if(!inputTitle){
            alert('Title is empty');
            return;
        }
        if(!textarea){
            alert('Note is empty');
            return;
        }
        let newObj = {
            id: num,
            title: inputTitle,
            description: textarea,
            status: status,
            priority: priority,
        }
        newArr.push(newObj);
        localStorage.setItem('todoItems', JSON.stringify(newArr));
        upDateCards();
    }

    if(e.target.classList.contains('delete')){
        newArr.forEach((elem, key) => {
            if(e.target.parentElement.id === elem.id){
                newArr.splice(key,1);
                localStorage.setItem('todoItems', JSON.stringify(newArr));
                upDateCards();
            }
        });    
    }
    if(e.target.classList.contains('edit')){
        newArr.forEach((elem, key) => {
            if(e.target.parentElement.id === elem.id){
                let title = document.getElementById(`${elem.id}-${elem.title}`);
                title.style.display = 'block'
                title.setAttribute('placeholder','new title...');
                let textarea = document.getElementById(`${elem.title}-${elem.id}`);
                textarea.style.display = 'block';
                textarea.textContent = elem.description;
                changeSelectOption();
                e.target.classList.value = 'save__new';
                e.target.textContent = 'Save';
                e.target.addEventListener('click', () => {
                    if(!title.value){
                        alert('Title is empty');
                        return; 
                    }
                    if(!textarea.value){
                        alert('Note is empty');
                        return;
                    }
                    elem.title = title.value;
                    elem.description = textarea.value;
                    localStorage.setItem('todoItems', JSON.stringify(newArr));
                    upDateCards();
                });
            }
        });
    }
});

function changeSelectOption() {
    document.addEventListener('change',(e) => {
        console.log(e.target.attributes);
        newArr.forEach(elem => {
            if('priority' + elem.id === e.target.id){
                elem.priority = e.target.value;    
            }
            if('status' + elem.id === e.target.id){
                elem.status = e.target.value;    
            }
        })
        localStorage.setItem('todoItems', JSON.stringify(newArr));
}); 
}

function deleteAllCards() {
    const cards = document.getElementById('cards');
    while (cards.firstChild) {
        cards.removeChild(cards.firstChild);
    }
}
