document.addEventListener('DOMContentLoaded', initializeTaskManager);

function initializeTaskManager() {
    const form = document.getElementById('task-form');
    const listContainer = document.getElementById('list-container');
    const createButton = document.getElementById('create-task');
    const totalPointsDisplay = document.getElementById('totalpoints');
    const messageboard = document.getElementById('messageboard');
    let totalPoints = 0;

    createButton.addEventListener('click', function(event) {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const categorySelect = document.getElementById('category');
        const category = categorySelect.value;
        const selectedOption = categorySelect.options[categorySelect.selectedIndex];
        const points = parseInt(selectedOption.getAttribute('data-value'), 10);

        if (description === "" || category === "") {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        const newTask = { description, category, points };
        
        // Send a POST request to create a new task in the database
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(response => response.json())
        .then(task => {
            console.log(task); // Ajoute cette ligne pour vérifier ce que renvoie le backend
            addTaskToList(task);
            totalPoints += points;
            totalPointsDisplay.textContent = ` ${totalPoints}`;
            checkPoints(totalPoints);
        })
        .catch(error => console.error('Error:', error));

        form.reset();
    });

    function checkPoints(points) {
    if (points >= 100) {
        messageboard.textContent = "Bravo, vous avez atteint 100 points !";
    } else {
        messageboard.textContent = "Continuez à ajouter des tâches !";
    }
}

    function addTaskToList(task) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${task.description}</strong> - ${task.category} - Points: ${task.points} <button class="delete-task">Supprimer</button>`;
        listItem.dataset.points = task.points;
        listItem.dataset.id = task.id;

        listItem.querySelector('.delete-task').addEventListener('click', function() {
            deleteTask(task.id, listItem);
        });

        listContainer.appendChild(listItem);

        switch (task.category) {
            case 'tachesmenageres':
                listItem.style.backgroundColor = '#F5B7B1';
                break;
            case 'tachesadmin':
                listItem.style.backgroundColor = '#FAD7A0';
                break;
            case 'devperso':
                listItem.style.backgroundColor = '#D4E6F1';
                break;
            default:
                listItem.style.backgroundColor = '#f0f0f0';
        }
    }

    function deleteTask(id, listItem) {
        fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            listContainer.removeChild(listItem);
            const points = parseInt(listItem.dataset.points, 10);
            totalPoints -= points;
            totalPointsDisplay.textContent = ` ${totalPoints}`;
            checkPoints(totalPoints);
        })
        .catch(error => console.error('Error:', error));
    }

    function loadTasks() {
        fetch('http://localhost:3000/tasks')
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    addTaskToList(task);
                    totalPoints += task.points;
                });
                totalPointsDisplay.textContent = ` ${totalPoints}`;
                checkPoints(totalPoints);
            })
            .catch(error => console.error('Error:', error));
    }

    loadTasks();
}












