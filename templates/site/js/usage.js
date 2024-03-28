var studentButton = document.getElementById('studentMenuButton');
var researcherButton = document.getElementById('researcherMenuButton');
var hobbyistButton = document.getElementById('hobbyistMenuButton');

var studentUser = document.getElementById('studentUser');
var researcherUser = document.getElementById('researcherUser');
var hobbyistUser = document.getElementById('hobbyistUser');

var displayArea = document.getElementById('getStartedDisplayArea')

studentButton.classList.add("text-primary") ;
displayArea.innerHTML = studentUser.innerHTML;

studentButton.onclick = function () {
    studentButton.classList.add("text-primary");
    researcherButton.classList.remove("text-primary");
    hobbyistButton.classList.remove("text-primary");

    displayArea.innerHTML = studentUser.innerHTML;

}

researcherButton.onclick = function () {
    studentButton.classList.remove("text-primary");
    researcherButton.classList.add("text-primary");
    hobbyistButton.classList.remove("text-primary");

    displayArea.innerHTML = researcherUser.innerHTML;

}

hobbyistButton.onclick = function () {
    studentButton.classList.remove("text-primary");
    researcherButton.classList.remove("text-primary");
    hobbyistButton.classList.add("text-primary");

    displayArea.innerHTML = hobbyistUser.innerHTML;

}