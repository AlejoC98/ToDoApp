
function updateLocalContent(key, value) {
    console.log();
}

function createMenuItem(list) {
    for(l in list) {
        var liEle = '<li id="list-'+ l +'" class="listItem"><a href="#"/>'+ l +'</li>';

        panel.insertAdjacentHTML("beforeend", liEle);
    }
}

function createList(list) {
    // Create var for localStorage
    var tasks = [...list];
    // Close Modal
    $("#addTaskListModal").modal("toggle");
    // Create Menu Item
    createMenuItem(tasks);
    // Updating localStorage
    updateLocalContent(tasks, []);
}

function openMenuItem() {

}