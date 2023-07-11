document.addEventListener("DOMContentLoaded", function(){
    fetch("/snippets/menu.html").then(resp => resp.text()).then(menu_html => {
        const menu = document.getElementById("menu");
        const template = document.createElement("template");
        template.innerHTML = menu_html;
        menu.appendChild(template.content)
    })
});