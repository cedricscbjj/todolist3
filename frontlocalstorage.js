document.addEventListener('DOMContentLoaded', initializeTaskManager);

function initializeTaskManager() {
    const form = document.getElementById('task-form');
    const listContainer = document.getElementById('list-container');
    const createButton = document.getElementById('create-task');
    const totalPointsDisplay = document.getElementById('totalpoints');
    const messageboard = document.getElementById('messageboard');
    let totalPoints = 0;

    createButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default button behavior

        const description = document.getElementById('description').value;
        const categorySelect = document.getElementById('category');
        const category = categorySelect.value;
        const selectedOption = categorySelect.options[categorySelect.selectedIndex];
        const points = parseInt(selectedOption.getAttribute('data-value'), 10);

        if (description === "" || category === "") {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        // Create list item
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${description}</strong> - ${category} - Points: ${points} <button class="delete-task btn btn-danger btn-sm">Supprimer</button>`;
        listItem.dataset.points = points;

        // Append list item to list container
        listContainer.appendChild(listItem);

        // Update total points
        totalPoints += points;
        totalPointsDisplay.textContent = ` ${totalPoints}`;
        checkPoints(totalPoints);

        listItem.querySelector('.delete-task').addEventListener('click', function() {
            listContainer.removeChild(listItem);
            totalPoints -= points;
            totalPointsDisplay.textContent = ` ${totalPoints}`;
            checkPoints(totalPoints);
            saveTasks();
        });

        switch (category) {
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

        saveTasks();

        // Clear form inputs
        form.reset();
    });

    function checkPoints(points) {
        if (points >= 50) {
            messageboard.textContent = "Vous avez atteint 50 points!";
        } else {
            messageboard.textContent = "Y'a rien a faire";
        }
    }

    function saveTasks() {
        const tasks = [];
        listContainer.querySelectorAll('li').forEach(item => {
            const description = item.querySelector('strong').innerText;
            const category = item.innerHTML.match(/- (.*?) -/)[1];
            const points = item.dataset.points;
            tasks.push({ description, category, points });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('totalPoints', totalPoints);
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
        totalPointsDisplay.textContent = ` ${totalPoints}`;
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${task.description}</strong> - ${task.category} - Points: ${task.points} <button class="delete-task btn btn-danger btn-sm">Supprimer</button>`;
            listItem.dataset.points = task.points;
            listContainer.appendChild(listItem);

            listItem.querySelector('.delete-task').addEventListener('click', function() {
                listContainer.removeChild(listItem);
                totalPoints -= task.points;
                totalPointsDisplay.textContent = ` ${totalPoints}`;
                checkPoints(totalPoints);
                saveTasks();
            });

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
        });
        checkPoints(totalPoints);
    }

    loadTasks();
}

