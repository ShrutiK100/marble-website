const converters = {
    "_default": (val) => val,
    "last_updated": (val) => new Date(val).toLocaleDateString("en-GB"),
    "location": (val) => `latitude: ${val.latitude} longitude: ${val.longitude}`,
    "services": (val) => {
        const template = document.createElement("template");
        const services_table_div = document.getElementById("servicesTable");
        const table = document.createElement("table");
        const table_head = document.createElement("thead")
        const table_body = document.createElement("tbody")
        const table_row = document.createElement("tr")
        const table_cell_service = document.createElement("td")
        const table_cell_description = document.createElement("td")
        table.classList.add("table", "table-striped");
        table.appendChild(table_head);
        table.appendChild(table_body);

        val.forEach( service => {
            service.links.forEach(link => {
                console.log(val.name)
                let name;
                let description;
                if (link.rel === "service") {
                    name = service.name;
                    description = service.description;
                    table_body.appendChild(table_row);
                    table_row.appendChild(table_cell_service);
                    table_row.appendChild(table_cell_description);
                    table_cell_description.textContent = description;
                } else if (link.rel === "service-doc") {
                    name = `${service.name} documentation`;
                } else {
                    name = `${service.name} ${link.rel}`;
                }
                const link_elem = document.createElement("a");
                console.log(service.links)
                Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value))
                link_elem.innerText = name;
                template.content.appendChild(link_elem);
                template.content.appendChild(document.createElement("br"))



                table_cell_service.appendChild(link_elem);





            })
            services_table_div.appendChild(table);
        })
        return template.content;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const githubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/current-registry/node_registry.json";
    const url_params = new URLSearchParams(window.location.search)
    const node_name = url_params.get("node");
    fetch(githubURL).then(resp => resp.json()).then(json => {
        const node_info = json[node_name];
        if (typeof node_info === "undefined") {
            if (url_params.has("node") && node_name.length > 0) {
                window.alert(`Error: no node named ${node_name}`);
            } else {
                window.alert("Error: no node name specified");
            }
        } else {
            Object.entries(node_info).forEach(([key, val]) => {
                const elem = document.getElementById(key);

                if (elem !== null) {

                    switch(key){
                        case "affiliation":
                            let title_affiliation = document.createElement("h2");
                            title_affiliation.textContent = val;
                            elem.append((converters[key] || converters["_default"])(title_affiliation));

                        break;
                        default:
                            elem.append((converters[key] || converters["_default"])(val));
                    }



                }
            })
        }


        node_info.links.forEach(link => {
            if (link.rel === "service") {
                const elem = document.getElementById("url");
                const link_elem = document.createElement("a");
                Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value));
                link_elem.innerText = link.href;
                elem.appendChild(link_elem)
            } else if (link.rel === "icon") {
                const elem = document.getElementById("icon");
                const icon_img = document.createElement("img")
                icon_img.setAttribute("src", link.href)
                elem.appendChild(icon_img)

                const background_elem = document.getElementById("background-icon");
                background_elem.style.backgroundImage="url(" + link.href + ")";
                background_elem.style.backgroundRepeat = "no-repeat";
                background_elem.style.backgroundSize = "cover";
                background_elem.style.width = "100%";
                background_elem.style.height = "100%";


                const background_icon_img = document.getElementById("node-overlay-img")
                background_icon_img.setAttribute("src", link.href);

                switch(node_name) {
                  case "PAVICS":
                    background_icon_img.classList.add("img-fluid","foreground-pavics-img-position");

                    break;
                  case "UofT":
                    background_icon_img.classList.add("img-fluid","foreground-uoft-img-position");

                    break;
                  case "Hirondelle":
                    background_icon_img.classList.add("img-fluid","foreground-hirondelle-img-position");
                  default:
                    background_icon_img.classList.add("img-fluid");
                }


            }
        })
    });
})