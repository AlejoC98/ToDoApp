
// Tooltips Initialize
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Global Vars
const completedListEle = document.querySelector("#completedTaskList");
const currentTaskEle = document.querySelector("#taskList");
const panel = document.querySelector("#task_list");
let localContent = Array();
let currentList = '';

if (localStorage.getItem("Lists") != null && JSON.parse(localStorage.getItem("Lists")) != null)
    localContent = JSON.parse(localStorage.getItem("Lists"));
else
    localStorage.setItem("Lists", "[]");

$(document).ready(function() {

    loadMenu();

    // Event for the modal
    $("#modal_btn").on("click", function() {
        $("#addTaskListModal").modal("toggle");
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

    $("#taskList").on("click", "input[type=checkbox], .btn-delete, .btn-edit", function() {

        var taskId = $(event.target).parents("li")[0];

        switch (event.target.className) {
            case 'btn btn-delete':
            case 'fa-solid fa-xmark':
                console.log("deleting");
                break;
            case 'btn btn-edit':
            case 'fa-solid fa-pencil':
                editTask(taskId);
                break;
            default:
                console.log("checkboc");
                break;
        }
    });

    // When input is blur I will clean the input
    $("input[type=text]").on("blur", function() {
        $(this).val("");
    });

});