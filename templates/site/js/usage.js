var studentButton = document.getElementById('studentMenuButton');
var researcherButton = document.getElementById('researcherMenuButton');
var hobbyistButton = document.getElementById('hobbyistMenuButton');

var studentUser = document.getElementById('studentUser');
var researcherUser = document.getElementById('researcherUser');
var hobbyistUser = document.getElementById('hobbyistUser');

var displayArea = document.getElementById('getStartedDisplayArea')

displayArea.innerHTML = studentUser.innerHTML;

studentButton.onclick = function () {
    displayArea.innerHTML = studentUser.innerHTML;

}

researcherButton.onclick = function () {
    displayArea.innerHTML = researcherUser.innerHTML;

}

hobbyistButton.onclick = function () {
    displayArea.innerHTML = hobbyistUser.innerHTML;

}