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

function createList(list) {
    var insertItem = {};
    insertItem[list] = [];
    // Close Modal
    $("#addTaskListModal").modal("toggle");
    localContent.push(insertItem);
    // Create Menu Item
    createMenuItem([list]);
    // Updating localStorage
    updateLocalContent();
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

function openMenuItem(element) {
    var listName = element.target.innerText;
    var listTask = [];
    localContent.map((element, index) => {
        if (listName in element)
            if (element[listName].length > 0)
                listTask = element[listName];
    });

    // Checking if this list already has tasks
    if (listTask.length > 0)
        // Here i will have a loop
        console.log();

    $("#listTitle").text(listName);
    $(".right-panel").css("opacity", "100");
    
    currentList = listName;
}

function getDate() {
    return new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
}

function createTask(input) {
    // Checking if object list containd the current list
    if (list = localContent.find((x) => Object.keys(x).includes(currentList) ))
        // Going through Task object
        list[currentList].map((task, index) => {
            // Checking if task already exist and returning and error
            if (task.name == input.value)
                return "error";
        });
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
}