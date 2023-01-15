function getLocalInfo() {
    localContent = JSON.parse(localStorage.getItem("Lists"));
}

function updateLocalContent() {
    localStorage.setItem("Lists", JSON.stringify(localContent));
}

function createListEle(id, list, status = "", className = "") {
    var element = '<li class="list-group-item animate__animated '+ className +'" id="task-'+ id +'">' +
        '<div class="check-box">' +
        '<input '+ status +' type="checkbox" id="checkTask-'+ id +'">' +
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

    // document.querySelector(list).insertAdjacentHTML("afterbegin", element);
    $(list).append(element);
}

function createErrorMg(id, mg, color) {
    $(id).addClass("text-" + color).text(mg);
    setTimeout(() => {
        $(id).text("");
    }, 4000);
}

function collapseMenu(btn) {
    let btnHamburger;
    if (localContent.length > 0) {
        $(".left-panel, .right-panel").toggleClass("collapsed");
        var nPosition;
        $(panel).find("li").each(function (index, element) {
            var liName = element.id.split("-")[1];
            if ($(".left-panel").hasClass("collapsed"))
                liName = liName[0].toUpperCase();
            $(element).find("a").text(liName);
        });
    } else {
        $(btn).addClass("animate__shakeX");
        btnHamburger = btn;
        setTimeout(() => {
            $(btnHamburger).removeClass("animate__shakeX");
        }, 1000);
    }

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
        createMenuItem([list.value], "animate__animated animate__bounceInDown");
        // Updating localStorage
        updateLocalContent();
        list.value = "";
    } else {
       return status;
    }
}

function createMenuItem(list, className = "") {
    // Looping the content to create a li for every item on the array
    for(l of list) {

        var dname;

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
        if (currentList in task) 
            task[currentList].map((element, index) => {
                var ltask = {};
                if (element.status == "active") {
                    ltask["container"] = currentTaskEle;
                    ltask["status"] = "";
                    ltask["class"] = "";
                } else {
                    ltask["container"] = completedListEle;
                    ltask["status"] = "checked";
                    ltask["class"] = "completed";
                }
                createListEle(element.name, ltask["container"], ltask["status"], ltask["class"]);
            });
    });
}

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
    return new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
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
            "date" : getDate()
        }
        // Updating localContent
        localContent.find((t) => {
            if (currentList in t)
                t[currentList].push(task);
        });
    
        // Creating task li element
        createListEle(task.name, "#taskList", "", "animate__backInDown animate__faster");
    
        // Updating localStorage
        updateLocalContent();
    } else {
        return status;
    }

}

function editTask(taskEle) {
    // saving current text
    var currentTask = taskEle.querySelector(".check-box").innerText;
    // Removing current text
    taskEle.querySelector(".check-box").innerText = "";
    // Creating the input element to edit content and adding a keypress event to it.
    $(taskEle).find(".check-box").append('<form action="/" id="updateForm"><input autofocus type="text" value="'+ currentTask +'" class="form-control"></form>');

    $("#updateForm input").focus();

    $("#updateForm").on("submit", function() {
        event.preventDefault();
        updateTask(currentTask, $(event.target).find("input").val());
    });
    $(taskEle).on("blur", ".check-box input[type=text]", function() {
        updateTask("", currentTask, false);
    });
}

function deleteTask(taskEle) {
    localContent.find((list, ind) => {
        if (currentList in list)
            list[currentList].map((task, index) => {
                var tName = task.name.toLowerCase();
                (tName === $(taskEle).text().toLowerCase()) ? list[currentList].splice(index, 1) : task;
            });
    });
    $(taskEle).addClass("animate__backOutDown");
    setTimeout(() => {
        $(taskEle).remove();
    }, 3000);
    updateLocalContent();
}

function checkTask(taskEle) {

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
                (tName === $(taskEle).text().toLowerCase()) ? task.status = ltask["status"] : task;
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

function updateTask(current, newTaskName, status = true) {
    if (status == true)
        localContent.find((list) => {
            if (currentList in list)
                list[currentList].map((task, index) => {
                    var tName = task.name.toLowerCase();
                    (tName=== current.toLowerCase()) ? task.name = newTaskName : task;
                });
        });

    $(event.target).parents(".check-box").append('<input type="checkbox">' + newTaskName);
    $(event.target).remove();
    updateLocalContent();
}

function searchTask(keyWord) {
    localContent.find((lists) => {
        if (currentList in lists)
            lists[currentList].map((task, index) => {
                var tName = task.name.toLowerCase();
                (tName.includes(keyWord.toLowerCase())) ? $("#task-"+task.name).fadeIn() : $("#task-"+task.name).fadeOut();
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