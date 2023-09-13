document.addEventListener("DOMContentLoaded", function () {
    fetch("/snippets/footer.html").then(resp => resp.text()).then(footer_html => {
        const footer = document.getElementById("footer");
        const template = document.createElement("template");
        template.innerHTML = footer_html;
        footer.appendChild(template.content)
    })
});