function getNodeRegistryInfo(){

    fetch("{{ node_registry_url }}").then(resp => resp.json()).then(resp =>  loadMenuLogo(resp) );
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
    getNodeRegistryInfo();
});