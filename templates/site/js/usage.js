var studentButton = document.getElementById('studentMenuButton');
var researcherButton = document.getElementById('researcherMenuButton');
var hobbyistButton = document.getElementById('hobbyistMenuButton');

var studentUser = document.getElementById('studentUser');
var researcherUser = document.getElementById('researcherUser');
var hobbyistUser = document.getElementById('hobbyistUser');

studentUser.style.display = 'block';
researcherUser.style.display = 'none';
hobbyistUser.style.display = 'none';

studentButton.onclick = function () {
    studentUser.style.display = 'block';
    researcherUser.style.display = 'none';
    hobbyistUser.style.display = 'none';
    studentUser.classList.toggle('fade');


}

researcherButton.onclick = function () {
    researcherUser.style.display = 'block';
    studentUser.style.display = 'none';
    hobbyistUser.style.display = 'none';
    researcherUser.classList.toggle('fade');


}

hobbyistButton.onclick = function () {
    hobbyistUser.style.display = 'block';
    studentUser.style.display = 'none';
    researcherUser.style.display = 'none';
    hobbyistUser.classList.toggle('fade');

}