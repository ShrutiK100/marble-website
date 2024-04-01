const converters = {
    "_default": (val) => val,
    "affiliation": (val) => {
        //let title_affiliation = document.createElement("h3");
        //title_affiliation.textContent = "@ " + val;
        //return title_affiliation;
    },
    "description": (val) => {
        let node_description_title = document.getElementById("nodeDescription");
        node_description_title.innerHTML = val;
        //return node_description_title;
    },
    "registration_status": (val) => {
        let registration_status_title = document.getElementById("nodeRegistrationStatus");
        registration_status_title.innerText = "Registration Status: " + val;
        registration_status_title.classList.add("registration-status-title");

        /*
        let registration_status = document.createElement("span");
        registration_status.innerText = val;

        let node_registration_status = document.createElement("div");
        node_registration_status.appendChild(registration_status_title);
        node_registration_status.appendChild(registration_status);
        return node_registration_status;*/
    },
    "contact": (val) => {
        let contact_email = document.getElementById("nodeContact");
        contact_email.href = "mailto:" + val;
        contact_email.innerText = val;
        //return contact_email;
    },
    "date_added": (val) => {
        let date_added = document.getElementById("nodeDateCreated")
        date_added.innerText = val;
        //new Date(val).toLocaleDateString("en-GB")
    },
    "location": (val) => {
        //`latitude: ${val.latitude} longitude: ${val.longitude}`
    },
//}

//const service_converters = {
    "services": (val) => {

        const services_row = document.createElement("div")
        services_row.classList.add("d-flex", "flex-wrap")

        val.forEach( service => {
            const node_card = document.createElement("div");
            node_card.classList.add("d-flex", "flex-column", "node-card");

            const node_heading= document.createElement("h5");
            const node_card_content = document.createElement("p");

            const node_card_button_container = document.createElement('div');
            node_card_button_container.classList.add("align-items-end", "mt-auto", "card-button-margin");

            node_card.appendChild(node_heading);
            node_card.appendChild(node_card_content);
            node_card.appendChild(node_card_button_container);

            let service_name = service.name;;
            let description = service.description;

            //Add the service description
            if (description != ""){
                const descriptionTextNode = document.createTextNode(description);
                node_card_content.appendChild(descriptionTextNode);
            }

            service.links.forEach(link => {
                let button_label;

                const node_card_href = document.createElement('a');
                node_card_href.classList.add("text-primary", "border", "border-dark", "rounded");

                if (link.rel === "service") {
                    button_label = "Link";
                    node_card_href.classList.add('node-card-link-button');
                }

                if (link.rel === "service-doc"){
                    button_label = "Documentation";
                    node_card_href.classList.add('node-card-doc-button');
                }

                Object.entries(link).forEach(([attr, value]) => node_card_href.setAttribute(attr, value))

                node_heading.innerText = service_name;
                node_card_href.innerText = button_label;

                if (node_card_href.rel === "service"){
                    node_card_button_container.appendChild(node_card_href);
                }

                if (node_card_href.rel === "service-doc"){
                    node_card_button_container.appendChild(node_card_href);
                }
            })
            services_row.appendChild(node_card)
        })
        //const services_div = document.getElementById("services");
        //services_rdivinnerHTML = services_row;
        return services_row;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const githubURL = "{{ node_registry_url }}";
    const url_params = new URLSearchParams(window.location.search)
    const node_name = url_params.get("node");
    fetch(githubURL).then(resp => resp.json()).then(json => {
        const menu_elem = document.getElementById("nodeMenu");
        const services_elem = document.getElementById("services");

        const node_info_elem = document.getElementById("nodeInfo");
        const node_menu_dropdown = document.createElement('select');

        var node_keys = Object.keys(json);
        var node_count = Object.keys(json).length;

            //If number of nodes larger than 3, create a dropdown from node 4 and up
            //If not, just create a menu with the nodes in the node registry
            if(node_count > 3){
                for(let i=0; i<=node_count; i++){
                    const dropdown_item = document.createElement('option')
                    dropdown_item.value =  json[node_keys[i]].name;
                    dropdown_item.innerHTML = json[node_keys[i]].name;
                    node_menu_dropdown.append(dropdown_item);
                }

                if (menu_elem !== null) {
                    menu_elem.append(node_menu_dropdown);
                }
            }
            else{
                for(let i = 0; i<=2; i++){
                    const node_menu_item = document.createElement('a');
                    node_menu_item.innerText = json[node_keys[i]].name;

                    if (menu_elem !== null) {
                    menu_elem.append(node_menu_item);
                    }
                }
            }


        Object.entries(json).forEach(([key, val]) => {

            Object.entries(json[key]).forEach(([node_key, node_val]) => {

                    const node_services_div = document.createElement("div");
                    node_services_div.id = key+"Services";
                    node_services_div.classList.add("w-75", "border", "border-dark");
                    node_services_div.append((converters[node_key] || converters["_default"])(node_val));

                    if (services_elem !== null) {
                        services_elem.append(node_services_div);
                    }



            })
        })
    });
})