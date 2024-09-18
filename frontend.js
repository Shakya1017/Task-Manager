document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mode-toggle');
    const modal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.modal .close');
    const taskList = document.getElementById('task-list');

    // Check localStorage to set the initial theme
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggle.checked = true;
    }

    // Toggle theme on change
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
            document.body.style.backgroundImage = 'url("darkbg.jpg")';
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
            document.body.style.backgroundImage = 'url("mainbg.jpg")';
        }
    });

    // Function to show the modal
    function showModal() {
        modal.style.display = 'block';
    }

    // Function to close the modal
    function closeModalHandler() {
        modal.style.display = 'none';
    }

    // Fetch tasks from the server and display them
    function fetchTasks() {
        fetch('http://localhost:3000/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';
                data.forEach(task => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="task-title">${task.title}</span>
                        <span class="task-date">${task.date}</span>
                        <div class="task-actions">
                            <button onclick="deleteTask(${task.id})">Delete</button>
                        </div>
                    `;
                    taskList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Handle task form submission
    document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const date = document.getElementById('task-date').value;

        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date })
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks(); // Refresh tasks list
            showModal(); // Show modal upon task addition
        })
        .catch(error => console.error('Error adding task:', error));
    });

    // Close the modal when the close button is clicked
    closeModal.addEventListener('click', closeModalHandler);

    // Close the modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // Delete a task by ID
    window.deleteTask = function(taskId) {
        fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' })
            .then(() => {
                fetchTasks(); // Refresh tasks list
            })
            .catch(error => console.error('Error deleting task:', error));
    };

    // Initial fetch of tasks
    fetchTasks();
});
