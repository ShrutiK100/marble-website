let executiveMenuButton = document.getElementById("executiveMenuButton");
let scientificMenuButton = document.getElementById("scientificMenuButton");

let executiveCommitteeDiv = document.getElementById("executiveCommittee");
let scientificCommitteeDiv = document.getElementById("scientificCommittee");

executiveMenuButton.classList.add("text-primary");
executiveCommitteeDiv.classList.remove("d-none");
executiveCommitteeDiv.classList.add("d-flex");

executiveMenuButton.onclick = function () {
    executiveMenuButton.classList.add("text-primary");

    executiveCommitteeDiv.classList.remove("d-none");
    executiveCommitteeDiv.classList.add("d-flex");

    scientificCommitteeDiv.classList.add("d-none");
}

scientificMenuButton.onclick = function () {
    executiveMenuButton.classList.remove("text-primary");

    scientificCommitteeDiv.classList.remove("d-none");
    scientificCommitteeDiv.classList.add("d-flex");

    executiveCommitteeDiv.classList.add("d-none");
}