
// Tooltips Initialize
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Global Vars
const completedListEle = document.querySelector("#completedTaskList");
const currentTaskEle = document.querySelector("#taskList");
const panel = document.querySelector("#task_list");
const localContent = localStorage.getItem("listTasks");

$(document).ready(function() {
    // Event for the modal
    $("#modal_btn").on("click", function() {
        $("#addTaskListModal").modal("toggle");
    });

    // Catch New list change
    $("#newListForm").on("submit", function(){
        event.preventDefault();
        createList($(event.target).find("input").val());
    });

    // Open List Tasks
    $("ul#task_list").on("click", "li", function(li) {
        openMenuItem();
    });

});