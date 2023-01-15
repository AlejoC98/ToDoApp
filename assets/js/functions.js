function getLocalInfo() {
    localContent = JSON.parse(localStorage.getItem("Lists"));
}

function updateLocalContent() {
    localStorage.setItem("Lists", JSON.stringify(localContent));
}

function createListEle(id, list) {
    var element = '<li class="list-group-item" id="task-'+ id +'">' +
        '<div class="check-box">' +
        '<input type="checkbox" id="checkTask-'+ id +'">' +
        id +
        '</div>' +
        '<div class="action-btn">' +
        '<button class="btn btn-delete" id="deleteTask-'+ id +'">' +
        '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
        '<button class="btn btn-edit" id="editTask-'+ id +'">' +
        '<i class="fa-solid fa-pencil"></i>' +
        '</button>' +
        '</li>' +
        '</div>';

    document.querySelector(list).insertAdjacentHTML("afterbegin", element);
}

function createErrorMg(id, mg, color) {
    $(id).addClass("text-" + color).text(mg);
    setTimeout(() => {
        $(id).text("");
    }, 4000);
}

function createList(list) {

    var status = false;

    if (localContent.length > 0)
        localContent.find((t) => {
            (!Object.keys(t).includes(list.value)) ? status = true : status;
        });
    else
        status = true;

    if (status == true) {
        var insertItem = {};
        insertItem[list.value] = [];
        // Close Modal
        $("#addTaskListModal").modal("toggle");
        localContent.push(insertItem);
        // Create Menu Item
        createMenuItem([list.value]);
        // Updating localStorage
        updateLocalContent();
        list.value = "";
    } else {
       return status;
    }
}

function createMenuItem(list) {
    // Looping the content to create a li for every item on the array
    for(l of list) {
        // Creating html element
        var liEle = '<li id="list-'+ l +'" class="listItem"><a href="#"/>'+ l +'</li>';
        // Adding li element to ul
        panel.insertAdjacentHTML("beforeend", liEle);
    }
}

function loadMenu() {
    var list = [];

    if (localContent.length > 0) {
        localContent.find((t) => {
            for (let listItem in t) {
                if (!list.includes(listItem))
                    list.push(listItem);
            }
        });
        // Creating list li elements
        createMenuItem(list);
    }
}

function loadListTasks() {
    localContent.find((task) => {
        task[currentList].map((element, index) => {
            var listEle = "";
            (element.status == "active") ? listEle = "#taskList" : listEle = "#completedTaskList";
            createListEle(element.name, listEle);
        });
    });
}

function openMenuItem(element) {
    var listName = element.target.innerText;
    var listTask = [];
    localContent.map((element, index) => {
        if (listName in element)
            if (element[listName].length > 0)
                listTask = element[listName];
    });

    currentList = listName;
    // Checking if this list already has tasks
    if (listTask.length > 0)
        // Here i will have a loop
        loadListTasks();
    $("#listTitle").text(listName);
    $(".right-panel").css("opacity", "100");
}

function getDate() {
    return new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
}

function createTask(input) {

    var status = true;

    // Checking if object list containd the current list
    if (list = localContent.find((x) => Object.keys(x).includes(currentList) ))
        // Going through Task object
        list[currentList].map((task, index) => {
            // Checking if task already exist and returning and error
            if (task.name == input.value)
                status = false;
        });
    
    if (status == true) {
        // Creating task object
        var task = {
            "name" : input.value,
            "status" : "active",
            "date" : getDate()
        }
        // Updating localContent
        localContent.find((t) => {
            t[currentList].push(task);
        });
    
        // Creating task li element
        createListEle(task.name, "#taskList");
    
        // Updating localStorage
        updateLocalContent();
    } else {
        return status;
    }

}

function editTask(task) {
    // saving current text
    var currentTask = task.querySelector(".check-box").innerText;
    // Removing current text
    task.querySelector(".check-box").innerText = "";


    $(task).find(".check-box").append('<input type="text" value="'+ currentTask +'" class="form-control">').on("keypress", function() { updateTask(currentTask) });

}

function updateTask(current) {

    console.log(current);

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
            }
            
    if (resetSatus == true)
        taskEle.querySelector(".check-box").innerHTML = '<input type="checkbox">' + newTaskName;

}