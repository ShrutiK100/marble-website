var studentButton = document.getElementById('studentMenuButton');
var researcherButton = document.getElementById('researcherMenuButton');
var hobbyistButton = document.getElementById('hobbyistMenuButton');

var studentUser = document.getElementById('studentUser');
var researcherUser = document.getElementById('researcherUser');
var hobbyistUser = document.getElementById('hobbyistUser');

var displayArea = document.getElementById('getStartedDisplayArea')

studentButton.style.color = "#304FFE";
displayArea.innerHTML = studentUser.innerHTML;

studentButton.onclick = function () {
    studentButton.style.color = "#304FFE";
    researcherButton.style.color = "#000000";
    hobbyistButton.style.color = "#000000";

    displayArea.innerHTML = studentUser.innerHTML;

}

researcherButton.onclick = function () {
    studentButton.style.color = "#000000";
    researcherButton.style.color = "#304FFE";
    hobbyistButton.style.color = "#000000";

    displayArea.innerHTML = researcherUser.innerHTML;

}

hobbyistButton.onclick = function () {
    studentButton.style.color = "#000000";
    researcherButton.style.color = "#000000";
    hobbyistButton.style.color = "#304FFE";

    displayArea.innerHTML = hobbyistUser.innerHTML;

}