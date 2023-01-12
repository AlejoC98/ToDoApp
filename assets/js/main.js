
// Tooltips Initialize
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Global vars
const tasks = {};

let listName;
let taskEle;

function collapseMenu() {

    var leftpanel = document.querySelector(".left-panel");
    var rightpanel = document.querySelector(".right-panel");
    
    if (leftpanel.classList.contains("collapsed")) {
        leftpanel.classList.remove("collapsed");
        rightpanel.classList.remove("collapsed");
    } else {
        leftpanel.classList.add("collapsed");
        rightpanel.classList.add("collapsed");
    }
}

function loadMenu() {
    var panel = document.querySelector(".task-list");


    for (list in tasks) {
        var liEle = '<li onclick="openList(openList(\''+ list +'\'))"><a href="#"/>'+ list +'</li>';

        panel.insertAdjacentHTML("beforeend", liEle);
    }
}

function openList(list) {
    if (list in tasks) {
        listName = list;
        document.querySelector("#listTitle").textContent = list;
        loadTasks(list);
        document.getElementsByClassName("right-panel")[0].style.opacity = 100;
    }
}

function openModal() {
    $("#addTaskListModal").modal("toggle");
}

function loadTasks(list) {
    var taskList = document.querySelector("#taskList");

    if (tasks[list].lenght > 0) {
        console.log("sisa");
    }

}

function createTaskList() {
    var listInput = document.querySelector("#createList");

    tasks[listInput.value] = [];

    openModal();

    loadMenu();

}

function deleteTask(task) {
    document.getElementById(task).remove();
}

function editTask(task) {
    taskEle = document.getElementById(task);
    // saving current text
    var currentTask = taskEle.querySelector(".check-box").innerText;
    // Removing current text
    taskEle.querySelector(".check-box").innerText = "";

    var changeInput = '<input type="text" value="'+ currentTask +'" class="form-control" onkeypress="updateTask(\''+ currentTask +'\')">';

    taskEle.querySelector(".check-box").insertAdjacentHTML("afterbegin", changeInput);

}

function updateTask(current) {

    var newTaskName = event.target.value;

    var resetSatus = false;

    switch (event.key) {
        case "Enter":
            for (let task of tasks[listName]) {
                (task.name === current) ? task.name = newTaskName : task.name;
            }
            resetSatus = true;
            break;
        case "Escape":
            newTaskName = current;
            resetSatus = true;
            break;
            default:
                break;
            }
            
    if (resetSatus == true)
        taskEle.querySelector(".check-box").innerHTML = '<input type="checkbox" onclick="completedTask(\'task-'+ taskEle.id +'\')">' + newTaskName;
    

}

document.getElementById("newTask").addEventListener("keypress", function(e) {
    if (e.key === "Enter" && e.target.value != "" && e.target.value != undefined) {
        
        var task = {
            "name" : e.target.value,
            "status" : "active",
        }

        tasks[listName].push(task);

        var taskElement = '<li class="list-group-item" id="task-'+ task.name +'">' +
        '<div class="check-box">' +
        '<input type="checkbox" onclick="completedTask(\'task-'+ task.name +'\')">' +
        task.name +
        '</div>' +
        '<div class="action-btn">' +
        '<button class="btn btn-delete" onclick="deleteTask(\'task-'+ task.name +'\')">' +
        '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
        '<button class="btn btn-edit" onclick="editTask(\'task-'+ task.name +'\')">' +
        '<i class="fa-solid fa-pencil"></i>' +
        '</button>' +
        '</li>' +
        '</div>';

        document.querySelector("#taskList").insertAdjacentHTML("afterbegin", taskElement);

        e.target.value = "";

    }
});