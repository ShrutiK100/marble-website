function getNodeRegistryInfo() {

    const githubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/current-registry/node_registry.json";

    fetch(githubURL).then(resp => resp.json()).then(resp =>  loadMenuLogo(resp) );
}

function loadMenuLogo(jsonTree){
    let iconURL = "";
    let menuLogo = "";
    let nodeLinkArray = jsonTree["UofT"].links;
    let nodeLinkArraySize = nodeLinkArray.length;

    for(let x = 0; x < nodeLinkArraySize; x++){
        let nodeLink = nodeLinkArray[x];
        if(nodeLink["rel"] == "icon"){
            menuLogo = document.getElementById("menu-logo");
            menuLogo.src = nodeLink["href"];
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    fetch("snippets/menu.html").then(resp => resp.text()).then(menu_html => {
        const menu = document.getElementById("menu");
        const template = document.createElement("template");
        template.innerHTML = menu_html;
        menu.appendChild(template.content);
        getNodeRegistryInfo();
    })


});