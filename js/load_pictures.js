document.addEventListener("DOMContentLoaded", function () {
    fetch("snippets/pictures.html").then(resp => resp.text()).then(pictures_html => {
        const pictures = document.getElementById("pictures");
        const template = document.createElement("template");
        template.innerHTML = pictures_html;
        pictures.appendChild(template.content)
    })
});