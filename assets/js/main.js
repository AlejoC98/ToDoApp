
const tasks = [];

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

function deleteTask(task) {
    document.getElementById(task).remove();
}

function completedTask(task) {
    var taskEle = document.getElementById(task);
    if (event.target.checked) {
        taskEle.style.textDecoration = "line-through";
        document.getElementsByClassName("completed-task")[0].style.display = "block";
        document.querySelector(".task-completed-list").appendChild(taskEle);
    } else {
        taskEle.style.textDecoration = "none";
        document.getElementsByClassName("completed-task")[0].style.display = "none";
        document.querySelector(".task-list").appendChild(taskEle);
    }
}

document.addEventListener("keypress", function(e) {
    
    if (e.key === "Enter" && e.target.value != "" && e.target.value != undefined) {

        var taskPosition = "task-";

        var task = {
            "name" : e.target.value,
            "status" : "active",
        }

        tasks.push(task);

        tasks.map((ele, index) => {
            // (ele.name == task.name) ? taskPosition = taskPosition + index.toString() : taskPosition = "task-";
            if (ele.name == task.name) {
                taskPosition = taskPosition + index.toString();
                ele["id"] = taskPosition;
            } else {
                taskPosition = "task-"
            }
        });

        var taskElement = '<li class="list-group-item" id="'+ taskPosition +'">' +
        '<span>' +
        '<input type="checkbox" onclick="completedTask(\''+ taskPosition +'\')">' +
        task.name +
        '</span>' +
        '<button class="btn btn-delete" onclick="deleteTask(\''+ taskPosition +'\')">' +
        '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
        '<button class="btn btn-edit" onclick="editTask()">' +
        '<i class="fa-solid fa-pencil"></i>' +
        '</button>' +
        '</li>';

        document.querySelector("#taskList").insertAdjacentHTML("afterbegin", taskElement);

        e.target.value = "";
    }
});