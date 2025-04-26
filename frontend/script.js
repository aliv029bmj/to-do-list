const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');

function fetchTasks(category = '', keyword = '') {
    let url = 'http://localhost:8080/api/tasks';
    if (category) {
        url = `http://localhost:8080/api/tasks/category/${category}`;
    } else if (keyword) {
        url = `http://localhost:8080/api/tasks/search?keyword=${keyword}`;
    }
    fetch(url)
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                const formattedDate = new Date(task.createdDate).toLocaleString('tr-TR');
                li.innerHTML = `
                    <div>
                        <span>${task.description}</span>
                        <small class="category">[${task.category}]</small>
                        <small class="date">Oluşturulma: ${formattedDate}</small>
                    </div>
                    <div>
                        <button onclick="toggleTask(${task.id}, ${!task.completed})">${task.completed ? 'Geri Al' : 'Tamamla'}</button>
                        <button onclick="deleteTask(${task.id})">Sil</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        });
}

function addTask() {
    const description = taskInput.value.trim();
    const category = categoryInput.value;
    if (description === '') return;

    fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, completed: false, category })
    })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks(categoryFilter.value, searchInput.value);
        });
}

function toggleTask(id, completed) {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: taskList.querySelector(`li:nth-child(${[...taskList.children].findIndex(li => li.querySelector('button').onclick.toString().includes(id)) + 1}) span`).textContent, completed, category: taskList.querySelector(`li:nth-child(${[...taskList.children].findIndex(li => li.querySelector('button').onclick.toString().includes(id)) + 1}) .category`).textContent.replace(/\[|\]/g, '') })
    })
        .then(() => fetchTasks(categoryFilter.value, searchInput.value));
}

function deleteTask(id) {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchTasks(categoryFilter.value, searchInput.value));
}

function filterTasks() {
    fetchTasks(categoryFilter.value, searchInput.value);
}

function searchTasks() {
    fetchTasks(categoryFilter.value, searchInput.value);
}

fetchTasks();
