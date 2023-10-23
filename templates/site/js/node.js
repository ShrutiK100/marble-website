const converters = {
    "_default": (val) => val,
    "affiliation": (val) => {
        let title_affiliation = document.createElement("h3");
        title_affiliation.textContent = "@ " + val;
        return title_affiliation;
    },
    "description": (val) =>{
        let node_description_title = document.createElement("h5");
        node_description_title.textContent = val;
        return node_description_title;
    },
    "contact": (val) =>{
        let contact_email = document.createElement("a");
        contact_email.href = "mailto:" + val;
        contact_email.innerText = val;
        return contact_email;
    },
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
        const table_body = document.createElement("tbody");

        services_table.classList.add("table");
        services_table.appendChild(table_head);
        table_head.appendChild(table_header_row);
        table_header_row.appendChild(table_header_service);
        table_header_row.appendChild(table_header_documentation);
        table_header_row.appendChild(table_header_description);

        table_header_service.setAttribute("scope", "col")
        table_header_documentation.setAttribute("scope", "col")
        table_header_description.setAttribute("scope", "col")

        table_header_service.innerText = "Service";
        table_header_description.innerText = "Description";
        table_header_documentation.innerText = "Documentation";

        services_table.appendChild(table_body);

        val.forEach( service => {
            const table_row = document.createElement("tr")
            //Add border to row to make it look like row has max amount of cells
            table_row.classList.add("border-bottom", "table-light")
            table_body.appendChild(table_row);

            const table_cell_description = document.createElement("td")
            let description = service.description;

            //Add the service description
            if (description != ""){
                const descriptionTextNode = document.createTextNode(description);
                table_row.appendChild(table_cell_description);
                table_cell_description.appendChild(descriptionTextNode);
            }

            service.links.forEach(link => {
                const link_elem = document.createElement("a");

                let name;

                if (link.rel === "service") {
                    name = service.name;
                }

                if (link.rel === "service-doc"){
                    name = "Documentation";
                }

                Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value))
                link_elem.innerText = name;

                //Add the columns with links and information for each service, service documentation before the
                // service description
                if (link_elem.rel === "service"){
                    let table_cell_service = table_row.insertCell(0)
                    table_cell_service.appendChild(link_elem);
                }

                if (link_elem.rel === "service-doc"){
                    let table_cell_documentation = table_row.insertCell(1)
                    table_cell_documentation.appendChild(link_elem);
                }
            })
        })
        return services_table;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const githubURL = "{{ node_registry_url }}";
    const url_params = new URLSearchParams(window.location.search)
    const node_name = url_params.get("node");
    fetch(githubURL).then(resp => resp.json()).then(json => {
        const node_info = json[node_name];
        if (typeof node_info === "undefined") {
            if (url_params.has("node") && node_name.length > 0) {
                window.alert(`Error: no node named ${node_name}`);
                window.history.back();
                return;
            } else {
                window.alert("Error: no node name specified");
                window.history.back();
                return;
            }
        } else {
            Object.entries(node_info).forEach(([key, val]) => {
                const elem = document.getElementById(key);

                if (elem !== null) {
                    elem.append((converters[key] || converters["_default"])(val));
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
                const icon_img = document.createElement("img")
                icon_img.setAttribute("src", link.href)

                const image_left = document.getElementById("image-left")
                if(image_left) {
                    image_left.classList.add("mw-50", "mh-50");
                    image_left.setAttribute("src", link.href);
                }

                const image_right = document.getElementById("image-right")
                if(image_right) {
                    image_right.classList.add("img-fluid", "mw-25","mh-25");
                    image_right.setAttribute("src", link.href);
                }

            }
        })

        const banner_title = document.getElementById("banner-title")
        if (banner_title) {
            banner_title.textContent = node_name
        }
    });
})