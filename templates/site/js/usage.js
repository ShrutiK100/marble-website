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
    displayArea.classList.toggle('fadeIn');
}

researcherButton.onclick = function () {
    displayArea.innerHTML = researcherUser.innerHTML;
    displayArea.classList.toggle('fadeIn');
}

hobbyistButton.onclick = function () {
    displayArea.innerHTML = hobbyistUser.innerHTML;
    displayArea.classList.toggle('fadeIn');
}