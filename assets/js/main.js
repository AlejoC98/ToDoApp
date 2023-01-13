
// Tooltips Initialize
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Global vars
const tasks = {};

const completedListEle = document.querySelector("#completedTaskList");
const currentTaskEle = document.querySelector("#taskList");

let listName;
let taskEle;

function collapseMenu() {
    $(".left-panel, .right-panel").toggleClass("collapsed");

    if ($(".left-panel, .right-panel").hasClass("collapsed")){
        $(this).find("li a").each(function(index, ele) {
            console.log(ele);
        });
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

    updateTaskLocalStorage(listInput.value);

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
        taskEle.querySelector(".check-box").innerHTML = '<input type="checkbox" onclick="checkTask(\'task-'+ taskEle.id +'\')">' + newTaskName;
    

}

function checkTask(task) {

    
    taskEle = document.getElementById(task);

    if (event.target.checked) {
        taskEle.style.textDecoration = "line-through";
        completedListEle.append(taskEle);
    } else {
        taskEle.style.textDecoration = "none";
        currentTaskEle.append(taskEle);
    }


}

$("#searchTask").on("focus", function(){
    $(currentTaskEle).find("li").css("display", "none");
    $(completedListEle).find("li").css("display", "none");
});

$("#searchTask").on("blur", function(){
    $(currentTaskEle).find("li").css("display", "flex");
    $(completedListEle).find("li").css("display", "flex");
});

function searchTask() {
    var keyWord = event.target.value;
    
    $(currentTaskEle).find("li .check-box").each((index, ele) => {
        if (keyWord != "") {
            if ($(ele).text().includes(keyWord))
                $(ele).parent().fadeIn("fast");
        } else {
            $(ele).parent().fadeIn("fast");
        }
    });
    
    $(completedListEle).find("li .check-box").each((index, ele) => {
        if (keyWord != "") {
            if ($(ele).text().includes(keyWord))
                $(ele).parent().fadeIn("fast");
        } else {
            $(ele).parent().fadeIn("fast");
        }
    });

}

function updateTaskLocalStorage(key, value = []) {

    localStorage.setItem(key, value);
}

function createTask() {
    if (event.key === "Enter" && event.target.value != "" && event.target.value != undefined) {
        
        var task = {
            "name" : event.target.value,
            "status" : "active",
        }

        tasks[listName].push(task);

        var taskElement = '<li class="list-group-item" id="task-'+ task.name +'">' +
        '<div class="check-box">' +
        '<input type="checkbox" onclick="checkTask(\'task-'+ task.name +'\')">' +
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

        event.target.value = "";

        // Checking local data
        if (storageTask = localStorage.getItem(listName) != null)
            storageTask.push(task)

        updateTaskLocalStorage(listName, storageTask);
    }
}