
// Tooltips Initialize
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Global Vars
const completedListEle = document.querySelector("#completedTaskList");
const currentTaskEle = document.querySelector("#taskList");
const panel = document.querySelector("#task_list");
let localContent = Array();
let currentList = '';

if (localStorage.getItem("Lists") != null && JSON.parse(localStorage.getItem("List")) != null)
    localContent = JSON.parse(localStorage.getItem("List"));
else
    localStorage.setItem("Lists", "[]");

$(document).ready(function() {


    // Event for the modal
    $("#modal_btn").on("click", function() {
        $("#addTaskListModal").modal("toggle");
    });

    // Catch New list change
    $("#newListForm").on("submit", function(){
        event.preventDefault();
        createList($(event.target).find("input").val());
        getLocalInfo();
    });

    // Open List Tasks
    $("ul#task_list").on("click", "li", function(li) {
        openMenuItem(li);
        // getLocalInfo();
    });
    // Checking when the user wants to create a task
    $("#newTaskForm").on("submit", function() {
        event.preventDefault();
        createTask(event.target.querySelector("input"));
        // getLocalInfo();
    });

    $("#taskList").on("click", ".check-box input, .btn-delete, .btn-edit", function(){
        alert("Sisaa");
    });

});