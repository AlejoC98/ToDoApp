// This fucntion is to update the localcontent from localstorage
function getLocalInfo() {
    localContent = JSON.parse(localStorage.getItem("Lists"));
}
// This function use the localcontent to update localstorage
function updateLocalContent() {
    localStorage.setItem("Lists", JSON.stringify(localContent));
}
// This function creates li elements, this is for the tasks
function createListEle(data, list, status = "", className = "") {

    var saveItem;
    // checking if the item to create has been saved
    (data.save === "saved") ? saveItem = '<i class="fa-solid fa-bookmark"></i>' : saveItem = '<i class="fa-regular fa-bookmark"></i>';
    // li element structure with the information provided
    var element = '<li class="list-group-item animate__animated '+ className +'" id="task-'+ data.name +'">' +
        '<div class="check-box">' +
        '<label for="favorite-'+ data.name +'" class="label-save '+ data.save +'">'+ saveItem +'</label>' +
        '<input type="checkbox" id="favorite-'+ data.name +'" class="favorite-check">' +
        '<input '+ status +' type="checkbox" class="check-status" id="checkTask-'+ data.name +'">' +
        '<span>' +
        data.name +
        '</span>' +
        '<q class="task-date">' +
        data.date +
        '</q>' +
        '</div>' +
        '<div class="action-btn">' +
        '<button class="btn btn-delete" id="deleteTask-'+ data.name +'">' +
        '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
        '<button class="btn btn-edit" id="editTask-'+ data.name +'">' +
        '<i class="fa-solid fa-pencil"></i>' +
        '</button>' +
        '</li>' +
        '</div>';
    // Checking if element already exist to do not create it
    if ($("#task-" + data.name).length <= 0)
        $(list).append(element);
}
// Fucntion to create li element on the left panel
function createMenuItem(list, className = "") {
    // Loop through the content to create a li for every item on the array
    for(l of list) {
        var dname;
        // Checking if the panel is collapsed
        if ($(".left-panel").hasClass("collapsed"))
            dname = l[0].toUpperCase();
        else
            dname = l;

        // Creating html element
        var liEle = '<li id="list-'+ l +'" class="listItem '+ className +'"><a href="#"/>'+ dname +'</li>';
        // Adding li element to ul
        panel.insertAdjacentHTML("beforeend", liEle);
    }
}

// Function to load messages for forms
function createErrorMg(id, mg, color) {
    // Add message text and color
    $(id).addClass("text-" + color).text(mg);
    // Setting up a time to remove the message after 4s
    setTimeout(() => {
        $(id).text("");
    }, 4000);
}
// Collapse menu function
function collapseMenu(btn) {
    let btnHamburger;
    // Checking if is there any data created
    if (localContent.length > 0) {
        // Toggle collapsed class on left panel element
        $(".left-panel, .right-panel").toggleClass("collapsed");
        // loop through all the li elements left panel
        $(panel).find("li").each(function (index, element) {
            // Getting li text
            var liName = element.id.split("-")[1];
            // Checking if the panel has the collapsed class
            if ($(".left-panel").hasClass("collapsed"))
                // Getting first letter of the li text and capitalize it
                liName = liName[0].toUpperCase();
            // Adding new name to lis element
            $(element).find("a").text(liName);
        });
    } else {
        // Add animation class to element
        $(btn).addClass("animate__shakeX");
        // Saving btn element for later
        btnHamburger = btn;
        setTimeout(() => {
            // Remove animation class after 1s
            $(btnHamburger).removeClass("animate__shakeX");
        }, 1000);
    }

}
// This fucntion is to create lists
function createList(listEle) {
    var status = false;
    // Getting new list name
    var lName = $(listEle).val().toLowerCase();
    // Checking if there's local data
    if (localContent.length > 0)
        // Loop through all the local list
        localContent.find((list) => {
            // Getting all list's names
            var listArray = Object.keys(list).map((l) => l.toLowerCase());
            // Validating if list already exist
            (!listArray.includes(lName)) ? status = true : status;
        });
    else
        status = true;
    
    // Checking status
    if (status == true) {
        var insertItem = {};
        // Capitalizing the list name
        listEle.value = listEle.value[0].toUpperCase() + listEle.value.slice(1);
        // Setting list content as empty array
        insertItem[listEle.value] = [];
        // Close Modal
        $("#addTaskListModal").modal("toggle");
        // Adding new list to local content
        localContent.push(insertItem);
        // Create Menu Item
        createMenuItem([listEle.value], "animate__animated animate__bounceInDown");
        // Updating localStorage
        updateLocalContent();
        // Cleaning new list input
        listEle.value = "";
    } else {
        // Returning error message
        return status;
    }
}

function loadMenu() {
    var listCont = [];
    // Checking if there's local Content
    if (localContent.length > 0) {
        // Loop through local content
        localContent.find((list) => {
            // Loop through all the list's names
            for (let listItem in list) {
                // Adding listItem to list var
                listCont.push(listItem);
            }
        });
        // Creating list li elements
        createMenuItem(listCont);
    }
}

// Fucntion to load List Tasks
function loadListTasks() {
    // Cleaning task container
    cleanTasks();
    // Loop through local caontent
    localContent.find((list) => {
        // checking if the current list is on list
        if (currentList in list)
            // Loop through list tasks
            list[currentList].map((element, index) => {
                var ltask = {};
                // Checking if the task is active or done
                if (element.status == "active") {
                    ltask["container"] = currentTaskEle;
                    ltask["status"] = "";
                    ltask["class"] = "";
                } else {
                    ltask["container"] = completedListEle;
                    ltask["status"] = "checked";
                    ltask["class"] = "completed";
                }
                // Creating task element
                createListEle(element, ltask["container"], ltask["status"], ltask["class"]);
            });
    });
}
// Function to open the list content
function openMenuItem(element) {
    var listName = element.currentTarget.id.split("-")[1];
    var listTask = [];

    $(currentTaskEle).empty();
    $(completedListEle).empty();

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
    $(".welcome-ms").css("display", "none");
    $(".main").css("display", "block");
}

function getDate() {
    return new Date().toLocaleDateString('fr-CA');
    // return new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
}

function createTask(input) {

    var status = true;

    // Checking if object list containd the current list
    if (list = localContent.find((x) => Object.keys(x).includes(currentList) ))
        // Going through Task object
        list[currentList].map((task, index) => {
            // Checking if task already exist and returning and error
            var tName = task.name.toLowerCase();
            if (tName == input.value.toLowerCase())
                status = false;
        });
    
    if (status == true) {
        // Creating task object
        var task = {
            "name" : input.value,
            "status" : "active",
            "date" : getDate(),
            "save" : "none"
        }
        // Updating localContent
        localContent.find((t) => {
            if (currentList in t)
                t[currentList].push(task);
        });
    
        // Creating task li element
        createListEle(task, "#taskList", "", "animate__backInDown animate__faster");
    
        // Updating localStorage
        updateLocalContent();
    } else {
        return status;
    }

}

function editTask(taskEle) {
    // saving current text
    // var currentTask = taskEle.querySelector(".check-box").innerText;
    var currentTask = $(taskEle).find(".check-box span").text();
    var currentTaskDate = $(taskEle).find(".check-box q").text();
    var currentTaskSave = $(taskEle).find("label").attr("class").split(" ")[1];
    // Removing current text
    taskEle.querySelector(".check-box").innerText = "";
    // Creating the input element to edit content and adding a keypress event to it.
    $(taskEle).find(".check-box").append('<form action="/" id="updateForm"><input autofocus type="text" value="'+ currentTask +'" class="form-control"></form>');

    $("#updateForm input").focus();

    $("#updateForm").on("submit", function() {
        event.preventDefault();
        updateTask(currentTask, $(event.target).find("input").val(), currentTaskDate, currentTaskSave);
    });
    $(taskEle).on("blur", ".check-box input[type=text]", function() {
        updateTask("", currentTask, false, currentTaskDate, currentTaskSave);
    });
}

function deleteTask(taskEle) {
    var lName = $(taskEle).find("span").text().toLowerCase();
    localContent.find((list, ind) => {
        if (currentList in list)
            list[currentList].map((task, index) => {
                var tName = task.name.toLowerCase();
                (tName === lName) ? list[currentList].splice(index, 1) : task;
            });
    });
    $(taskEle).addClass("animate__backOutDown");
    setTimeout(() => {
        $(taskEle).remove();
    }, 3000);
    updateLocalContent();
}

function checkTask(taskEle) {

    var eleText = $(taskEle).find("span").text().toLowerCase();

    var ltask = {
        "aClass": "animate__flipOutX",
        "rClass" : "animate__flipInX"
    };

    if ($(taskEle).find("input").is(":checked")) {
        ltask["status"] = "done";
        ltask["container"] = completedListEle;
    } else {
        ltask["status"] = "active";
        ltask["container"] = currentTaskEle;
    }

    localContent.find((list, ind) => {
        if (currentList in list)
            list[currentList].map((task, index) => {
                var tName = task.name.toLowerCase();
                (tName === eleText) ? task.status = ltask["status"] : task;
            });
    });
    $(taskEle).addClass(ltask["aClass"]).removeClass(ltask["rClass"]);
    
    setTimeout(() => {
        $(taskEle).addClass(ltask["rClass"]).removeClass(ltask["aClass"]);
        $(ltask["container"]).append(taskEle);
    }, 1000);

    $(taskEle).toggleClass("completed");
    updateLocalContent();
}

function updateTask(current, newTaskName, status = true, date, save) {
    if (status == true)
        localContent.find((list) => {
            if (currentList in list)
                list[currentList].map((task, index) => {
                    var tName = task.name.toLowerCase();
                    (tName=== current.toLowerCase()) ? task.name = newTaskName : task;
                });
        });
    
    var saveItem;
    
    (save === "saved") ? saveItem = '<i class="fa-solid fa-bookmark"></i>' : saveItem = '<i class="fa-regular fa-bookmark"></i>';

    $(event.target).parents(".check-box").append(
        '<label for="favorite-'+ newTaskName +'" class="label-save '+ save +'">'+ saveItem +'</label><input type="checkbox" id="favorite-'+ newTaskName +'" class="favorite-check"><input type="checkbox"><span>' + newTaskName + '</span><q class="task-date">'+ date +'</q>'
        );
    $(event.target).remove();
    updateLocalContent();
}

function cleanTasks() {
    $(currentTaskEle).find("li").css("display", "none").remove();
    $(completedListEle).find("li").css("display", "none").remove();
}

function searchTask(keyWord, filter = "name") {
    localContent.find((lists) => {
        if (currentList in lists)
            lists[currentList].map((task, index) => {
                var tName = task[filter].toLowerCase();
                var action;
                var liElement = {
                    "class" : "",
                    "status" : ""
                }

                if (task.status == "active") {
                    liElement["insertTo"] = currentTaskEle;
                } else {
                    liElement["insertTo"] = completedListEle;
                    liElement["class"] = "completed";
                    liElement["status"] = "checked";
                }

                switch (filter) {
                    case "date":
                    case "save":
                        if (tName === keyWord)
                            action = "create";
                        else
                            action = "remove";
                        break;
                    default:
                        if (tName.includes(keyWord.toLowerCase()))
                            action = "create";
                        else
                            action = "remove";
                        break;
                }

                if (action == "create") 
                    createListEle(task, liElement["insertTo"], liElement["status"], liElement["class"]);
                else if (action == "remove")
                    $("#task-"+task.name).fadeOut(1).remove();

            });
    });

}

function deleteList() {

    localContent.find((list, ind) => {
        (currentList in list) ? localContent.splice(ind, 1) : list;
    });
    $("#deleteTaskListModal").modal("hide");
    $(".modal-backdrop").remove();
    $(".main").css("display", "0");
    $("#list-" + currentList).fadeOut().remove();
    updateLocalContent();
}

function saveLater(element) {
    var liElement = $(element).parents("li");
    var liName = $(element).attr("id").split("-")[1].toLowerCase();
    var status;
    $(liElement).find(".label-save").empty();
    if($(element).is(":checked")) {
        $(liElement).find(".label-save").addClass("saved");
        $(liElement).find(".label-save").append('<i class="fa-solid fa-bookmark"></i>');
        status = "saved";
    } else {
        $(liElement).find(".label-save").removeClass("saved");
        $(liElement).find(".label-save").append('<i class="fa-regular fa-bookmark"></i>');
        status = "none";
    }

    localContent.find((list) => {
        list[currentList].map((task, index) => {
            var tName = task.name.toLowerCase();
            (tName == liName) ? task.save = status : task;
        });
    });
    updateLocalContent();
}

function resizeEvent() {
    if (document.documentElement.clientWidth <= 500) {
        $(".fil-opt").appendTo("#collapseFilters .card-body");
        $("#btn-collapse-filter").css("display", "inline-block");
    } else {
        $(".fil-opt").prependTo(".filter-section");
        $("#btn-collapse-filter").css("display", "none");
        $("#collapseFilters").collapse("hide");
    }
}