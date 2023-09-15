document.addEventListener("DOMContentLoaded", function () {
    fetch("snippets/banner.html").then(resp => resp.text()).then(banner_html => {
        const banner = document.getElementById("banner");
        const template = document.createElement("template");
        template.innerHTML = banner_html;
        banner.appendChild(template.content)
    })
});