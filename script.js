
document.getElementById('add-task-button').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const taskList = document.getElementById('task-list');

    const listItem = document.createElement('li');
    listItem.className = 'task-item';

    const taskNumber = document.createElement('span');
    taskNumber.className = 'task-number';
    taskNumber.textContent = taskList.children.length + 1;

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'task-buttons';

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.setAttribute('aria-label', `Complete task "${taskText}"`);
    completeButton.setAttribute('tabindex', '0');
    completeButton.addEventListener('click', function () {
        showConfirmationDialog(taskText, function() {
            taskSpan.textContent = `Task "${taskText}" Completed`;
            listItem.classList.add('complete');
            buttonContainer.remove();
            moveToBottom(listItem);
            updateTaskNumbers();
            updateTaskStats(); // Update task stats when task is completed
            showFeedback('Task completed!');
        });
    });

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.setAttribute('aria-label', `Edit task "${taskText}"`);
    editButton.setAttribute('tabindex', '0');
    editButton.addEventListener('click', function () {
        const newTaskText = prompt('Edit your task:', taskSpan.textContent);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            taskSpan.textContent = newTaskText.trim();
            updateTaskNumbers();
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete task "${taskText}"`);
    deleteButton.setAttribute('tabindex', '0');
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(listItem);
        updateTaskNumbers();
        updateTaskStats(); // Update task stats when task is deleted
        showFeedback('Task deleted!');
    });

    const priorityButton = document.createElement('button');
    priorityButton.className = 'priority-button';
    priorityButton.textContent = 'Priority';
    priorityButton.setAttribute('aria-label', `Set priority for task "${taskText}"`);
    priorityButton.setAttribute('tabindex', '0');
    priorityButton.addEventListener('click', function () {
        listItem.classList.toggle('high-priority');
        priorityButton.classList.toggle('high-priority');
        priorityButton.textContent = listItem.classList.contains('high-priority') ? 'High Priority' : 'Priority';
        moveToTop(listItem);
        updateTaskNumbers();
    });

    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(priorityButton);

    listItem.appendChild(taskNumber);
    listItem.appendChild(taskSpan);
    listItem.appendChild(buttonContainer);

    insertBeforeFirstCompletedTask(taskList, listItem);
    taskInput.value = '';
    document.getElementById('add-task-button').disabled = true; // Disable button until input is not empty

    updateTaskNumbers();
    updateTaskStats(); // Update task stats when new task is added
    showFeedback('Task added!');
}

function insertBeforeFirstCompletedTask(taskList, listItem) {
    const completedTasks = taskList.querySelectorAll('.complete');
    if (completedTasks.length > 0) {
        taskList.insertBefore(listItem, completedTasks[0]);
    } else {
        taskList.appendChild(listItem);
    }
    updateTaskNumbers();
}

function updateTaskNumbers() {
    const taskItems = document.querySelectorAll('#task-list .task-item');
    taskItems.forEach((item, index) => {
        const taskNumber = item.querySelector('.task-number');
        taskNumber.textContent = index + 1;
    });
}

function updateTaskStats() {
    const totalTasks = document.getElementById('task-list').children.length;
    const completedTasks = document.querySelectorAll('#task-list .task-item.complete').length;
    const inProgressTasks = totalTasks - completedTasks;

    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('tasks-in-progress').textContent = inProgressTasks;
    document.getElementById('tasks-completed').textContent = completedTasks;
}

function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(feedback), 500);
    }, 2000);
}

function showConfirmationDialog(taskTitle, onConfirm) {
    const dialog = document.createElement('div');
    dialog.id = 'custom-confirm';
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.width = '100%';
    dialog.style.height = '100%';
    dialog.style.background = 'rgba(0, 0, 0, 0.5)';
    dialog.style.display = 'flex';
    dialog.style.alignItems = 'center';
    dialog.style.justifyContent = 'center';
    dialog.style.zIndex = '1000';
    dialog.style.visibility = 'hidden';
    dialog.style.opacity = '0';
    dialog.style.transition = 'opacity 0.3s ease';

    const content = document.createElement('div');
    content.style.background = '#fff';
    content.style.padding = '20px';
    content.style.borderRadius = '5px';
    content.style.textAlign = 'center';

    const message = document.createElement('p');
    message.textContent = `Are you sure you want to mark the task "${taskTitle}" as completed?`;

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.className = 'yes';
    yesButton.style.backgroundColor = '#4CAF50';
    yesButton.style.color = '#fff';
    yesButton.style.padding = '10px';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '5px';
    yesButton.style.cursor = 'pointer';
    yesButton.style.margin = '5px';

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.className = 'no';
    noButton.style.backgroundColor = '#f44336';
    noButton.style.color = '#fff';
    noButton.style.padding = '10px';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '5px';
    noButton.style.cursor = 'pointer';
    noButton.style.margin = '5px';

    content.appendChild(message);
    content.appendChild(yesButton);
    content.appendChild(noButton);
    dialog.appendChild(content);

    document.body.appendChild(dialog);

    setTimeout(() => {
        dialog.style.visibility = 'visible';
        dialog.style.opacity = '1';
    }, 0);

    yesButton.onclick = function() {
        dialog.style.visibility = 'hidden';
        dialog.style.opacity = '0';
        document.body.removeChild(dialog);
        onConfirm();
    };

    noButton.onclick = function() {
        dialog.style.visibility = 'hidden';
        dialog.style.opacity = '0';
        document.body.removeChild(dialog);
    };
}

function moveToTop(element) {
    const taskList = document.getElementById('task-list');
    const completedTasks = taskList.querySelectorAll('.complete');
    if (completedTasks.length > 0) {
        taskList.insertBefore(element, completedTasks[0]);
    } else {
        taskList.insertBefore(element, taskList.firstChild);
    }
    updateTaskNumbers();
}

function moveToBottom(element) {
    const taskList = document.getElementById('task-list');
    taskList.appendChild(element);
    updateTaskNumbers();
}

// Enable "Add Task" button only if the input field is not empty
document.getElementById('new-task').addEventListener('input', function() {
    document.getElementById('add-task-button').disabled = this.value.trim() === '';
});
