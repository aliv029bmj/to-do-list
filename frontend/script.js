const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

function fetchTasks() {
    fetch('http://localhost:8080/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <span>${task.description}</span>
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
    if (description === '') return;

    fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, completed: false })
    })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        });
}

function toggleTask(id, completed) {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: taskList.querySelector(`li:nth-child(${[...taskList.children].findIndex(li => li.querySelector('button').onclick.toString().includes(id)) + 1}) span`).textContent, completed })
    })
        .then(() => fetchTasks());
}

function deleteTask(id) {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchTasks());
}

// İlk yüklemede görevleri getir
fetchTasks();
