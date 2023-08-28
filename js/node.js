const converters = {
    "_default": (val) => val,
    "last_updated": (val) => new Date(val).toLocaleDateString("en-GB"),
    "location": (val) => `latitude: ${val.latitude} longitude: ${val.longitude}`,
    "services": (val) => {
        //Create table for services information
        const services_table = document.createElement("table");
        const table_head = document.createElement("thead");
        const table_header_row = document.createElement("tr");
        const table_header_service = document.createElement("th");
        const table_header_description = document.createElement("th");
        const table_header_documentation = document.createElement("th");
        const table_header_other = document.createElement("th");
        const table_body = document.createElement("tbody");

        services_table.classList.add("table", "table-light");
        services_table.appendChild(table_head);
        table_head.appendChild(table_header_row);
        table_header_row.appendChild(table_header_service);
        table_header_row.appendChild(table_header_documentation);
        table_header_row.appendChild(table_header_description);
        table_header_row.appendChild(table_header_other);

        table_header_service.setAttribute("scope", "col")
        table_header_documentation.setAttribute("scope", "col")
        table_header_description.setAttribute("scope", "col")
        table_header_other.setAttribute("scope", "col")

        table_header_service.innerText = "Service";
        table_header_description.innerText = "Description";
        table_header_documentation.innerText = "Documentation";
        table_header_other.innerText = "Other";

        services_table.appendChild(table_body);

        val.forEach( service => {
            const table_row = document.createElement("tr")
            //Add border to row to make it look like row has max amount of cells
            table_row.classList.add("border-bottom")
            table_body.appendChild(table_row);

            service.links.forEach(link => {

                const table_cell_service = document.createElement("td")
                const table_cell_description = document.createElement("td")
                const table_cell_documentation = document.createElement("td")
                const table_cell_other = document.createElement("td")

                const link_elem = document.createElement("a");

                let name;
                let description;

                if (link.rel === "service") {
                    name = service.name;
                } else if (link.rel === "service-desc" ) {
                    name = `${service.name} description`;
                    description = service.description;
                }else if (link.rel === "service-doc") {
                    name = `${service.name} documentation`;
                }else {
                    name = `${service.name} ${link.rel}`;
                }

                Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value))
                link_elem.innerText = name;

                //Fill in columns with links and information for each service, service documentation
                // and service description
                if(link_elem.rel === "service"){
                    table_row.appendChild(table_cell_service);
                    table_cell_service.appendChild(link_elem);
                }else if(link_elem.rel === "service-doc"){
                    table_row.appendChild(table_cell_documentation);
                    table_cell_documentation.appendChild(link_elem);
                }else if(link_elem.rel === "service-desc"){
                    const descriptionTextNode = document.createTextNode(description);
                    table_row.appendChild(table_cell_description);
                    table_cell_description.appendChild(descriptionTextNode);
                    table_cell_description.appendChild(document.createElement("br"))
                    table_cell_description.appendChild(link_elem);
                }else{
                    table_row.appendChild(table_cell_other);
                    table_cell_other.appendChild(link_elem)
                }
            })
        })
        return services_table;
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
                            let title_affiliation = document.createElement("h3");
                            title_affiliation.textContent = "@ " + val;
                            elem.append((converters[key] || converters["_default"])(title_affiliation));
                        break;

                       case "description":
                            let node_description_title = document.createElement("h5");
                            node_description_title.textContent = val;
                            elem.append((converters[key] || converters["_default"])(node_description_title));
                        break;

                        case "last_updated":
                            elem.append((converters[key] || converters["last_updated"])(val));
                        break;

                        case "contact":
                            let contact_email = document.getElementById("contact");
                            elem.append((converters[key] || converters["_default"])(val));
                        break;

                        case "version":
                            let node_version = document.getElementById("version");
                            node_version.textContent = val;
                            elem.append((converters[key] || converters["_default"])(val));
                        break;

                        case "services":
                            elem.append((converters[key] || converters["services"])(val));
                        break;

                        case "url":
                            elem.append((converters[key] || converters["_default"])(val));
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
                let small_logo_link = document.getElementById("small-logo-link");
                small_logo_link.href = link.href;

                Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value));
                link_elem.innerText = link.href;
                elem.appendChild(link_elem)
            } else if (link.rel === "icon") {
                const icon_img = document.createElement("img")
                icon_img.setAttribute("src", link.href)

                const background_elem = document.getElementById("background-icon");
                background_elem.style.backgroundImage="url(" + link.href + ")";
                background_elem.style.backgroundRepeat = "no-repeat";
                background_elem.style.backgroundSize = "cover";
                background_elem.style.width = "100%";
                background_elem.style.height = "100%";
                background_elem.classList.add("info-background");

                const title_icon_img = document.getElementById("title-icon-img")
                title_icon_img.classList.add("img-fluid", "d-block", "float-end");
                title_icon_img.setAttribute("src", link.href);

                //Used to position the sharp logo overlayed on the blurred logo.
                //This effect may be used in the future
                /*
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
                */
            }
        })

        const page_title_div = document.getElementById('page_title_div');
        const page_title_markup = document.createElement("h1")
        let page_title = "You Are Viewing the " + node_name + " Node";
        page_title_markup.textContent = page_title
        page_title_div.appendChild(page_title_markup);

        const node_name_markup = document.createElement("h2");
        const node_name_title = document.getElementById("name");
        node_name_markup.textContent = node_name;
        node_name_title.appendChild(node_name_markup)

    });
})