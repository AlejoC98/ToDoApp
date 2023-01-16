
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

    // Call function to load the menu items
    loadMenu();

    // Event for the hamburguer icon
    $("#menu-btn").on("click", function() {
        collapseMenu(event.currentTarget);
    });

    // Event for the modal
    $("#modal_btn").on("click", function() {
        $("#addTaskListModal").modal("toggle");
    });

    // Event for the delete list button
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

    // This event is just to clean the task input when it's unfocus.
    $("#newTask").on("blur", function() {
        $(this).val("");
    });

    // This event is to catch the click on any of the task actions buttons
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

    // Event when the searcg bar is focus, when the user type any letter the search will start.
    $("#searchTask").on("focus", function() {
        // Hidding all tasks to have a clean search
        if (event.target.value == "")
            cleanTasks();
    }).on("keyup", function() {
        if (event.target.value != "")
            searchTask(event.target.value);
        else
            loadListTasks();
    });

    // Event when the date filter has chnage and it will start the search
    $("#dateFilter").on("change", function() {
        // Hidding all tasks
        cleanTasks();
        // Start the search
        searchTask(event.target.value, "date");
    });

    // Event for the reset filter button
    $("#reset-sort").on("click", function() {
        $("#dateFilter").val("");
        // Load all task from zero
        loadListTasks();
    });

    // Event for the select filter option
    $("#multi-filter").on("change", function() {
        // Checking which option has been selected
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