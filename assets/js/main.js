
// Tooltips Initialize
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Global Vars
const currentTaskEle = document.querySelector("#taskList");
const completedListEle = document.querySelector("#completedTaskList");
const panel = document.querySelector("#task_list");
let localContent = Array();
let currentList = '';

if (localStorage.getItem("Lists") != null && JSON.parse(localStorage.getItem("Lists")) != null)
    localContent = JSON.parse(localStorage.getItem("Lists"));
else
    localStorage.setItem("Lists", "[]");

$(document).ready(function() {

    loadMenu();

    $("#menu-btn").on("click", function() {
        collapseMenu(event.currentTarget);
    });

    // Event for the modal
    $("#modal_btn").on("click", function() {
        $("#addTaskListModal").modal("toggle");
    });

    $("#deleteTaskListModal .btn-theme-primary").on("click", function() {
        deleteList();
    });

    // Catch New list change
    $("#newListForm").on("submit", function(){
        event.preventDefault();
        if (createList(event.target.querySelector("input")) == false) {
            createErrorMg("#newListMg", "List already exist!", "danger");
        } else {
            getLocalInfo();
        }
    });

    // Open List Tasks
    $("ul#task_list").on("click", "li", function(li) {
        openMenuItem(li);
    });
    // Checking when the user wants to create a task
    $("#newTaskForm").on("submit", function() {
        event.preventDefault();
        if (createTask(event.target.querySelector("input")) == false)
            createErrorMg("#newTaksMg", "Task already exist!", "danger");
        else
            event.target.querySelector("input").value = "";
    });

    $("#newTask").on("blur", function() {
        $(this).val("");
    });

    $("#taskList, #completedTaskList").on("click", "input.check-status, .btn-delete, .btn-edit, input.favorite-check", function() {

        // Getting event target li parent
        var taskId = $(event.target).parents("li")[0];

        // Checking what action will take
        switch (event.target.className) {
            case 'btn btn-delete':
            case 'fa-solid fa-xmark':
                deleteTask(taskId);
                break;
            case 'btn btn-edit':
            case 'fa-solid fa-pencil':
                editTask(taskId);
                break;
            case "favorite-check":
                saveLater(event.target);
                break;
            default:
                checkTask(taskId);
                break;
        }
    });

    $("#searchTask").on("focus", function() {
        // Hidding all tasks
        if (event.target.value == "")
            cleanTasks();
    }).on("keyup", function() {
        if (event.target.value != "")
            searchTask(event.target.value);
        else
            loadListTasks();
    });

    $("#dateFilter").on("change", function() {
        // Hidding all tasks
        cleanTasks();
        searchTask(event.target.value, "date");
    });

    $("#reset-date").on("click", function() {
        $("#dateFilter").val("");
        loadListTasks();
    });

    $("#multi-filter").on("change", function() {
        switch ($(event.target).find(":selected").val()) {
            case "late":
                searchTask("saved", "save");
                break;
            default:
                loadListTasks();
                break;
        }
    });

});