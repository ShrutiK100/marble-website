const converters = {
    "_default": (val) => val,
    "contact": (val) => `mailto:${val}`,
    "date_added": (val) => {
        let date = new Date(val);
        return date.toLocaleDateString();
    },
    "status":(val) =>{
        let node_status = document.createElement("span")
        node_status.innerText = val;
        node_status.classList.add(val === "online" ? "node-online" : "node-offline")
        return node_status
    },
    "links": (val, node_info) => {
        const found_links = {}
        const link_elems = {
            "service": document.getElementById("node-name-link"),
            "authenticate": document.getElementById("node-sign-in-button"),
            "registration": document.getElementById("node-registration-link-button")
        }
        val.forEach(link => {
            if (link_elems[link.rel]) {
                if (link.rel === "registration" && node_info.registration_status === "closed") { return }
                found_links[link.rel] = true;
                Object.entries(link).forEach(([attr, value]) => link_elems[link.rel].setAttribute(attr, value));
            }
        })
        Object.entries(link_elems).forEach(([rel, elem]) => {
            if (!found_links[rel]) {
                elem.classList.add("disabled")
            }
        })
    },
    "services": (val) => {

        const services_row = document.createElement("div");
        services_row.id = "nodeServices";
        services_row.classList.add("d-flex", "flex-wrap", "justify-content-start");

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

            let service_name = service.name;
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
                    node_card_href.classList.add("caption", "node-card-link-button");
                }

                if (link.rel === "service-doc"){
                    button_label = "Documentation";
                    node_card_href.classList.add("caption", "node-card-doc-button");
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
        let services_div = document.getElementById("services");
        services_div.innerHTML = "";
        services_div.append(services_row);
    }
}

const nodeImageBackground = [
    "images/nodes/node-redoak-planet.png",
    "images/nodes/node-pavics-planet.jpg",
    "images/nodes/node-hirondelle-planet.jpg"
];

document.addEventListener("DOMContentLoaded", function () {
    const githubURL = "{{ node_registry_url }}";
    fetch(githubURL).then(resp => resp.json()).then(json => {
        const menu_elem = document.getElementById("nodeMenu");
        const node_dropdown_container = document.getElementById("nodeDropdownContainer")
        const node_dropdown_content = document.getElementById("nodeDropdownContent")

        var node_keys = Object.keys(json);
        var node_count = node_keys.length;

        if (node_count > 0) {
            const url_params = new URLSearchParams(window.location.search);
            const param_node_key = url_params.get("node");
            const default_node_key = json[param_node_key] ? param_node_key : node_keys[0]
            // Display the first node's information and services by default.
            getNode(default_node_key);
        }

        // Node Menu
        // If number of nodes larger than initial_node_count, create a menu with these first nodes, and create a dropdown
        // for the rest. If not, just create a menu with the nodes in the node registry
        const initial_node_count = 2;
        node_keys.forEach((key, index) => {
            const node_menu_item = document.createElement('a');
            node_menu_item.setAttribute('onclick', 'getNode(' + '"'+ key +'"' + ')');
            node_menu_item.innerText = json[key].name;
            if (index < initial_node_count) {
                const h3_node_menu_item = document.createElement("h3");
                h3_node_menu_item.classList.add("node-menu-item")
                h3_node_menu_item.appendChild(node_menu_item)
                menu_elem.insertBefore(h3_node_menu_item, node_dropdown_container);
            } else {
                const h5_dropdown_item = document.createElement('h5');
                h5_dropdown_item.classList.add("dropdown-menu-item")
                h5_dropdown_item.appendChild(node_menu_item)
                node_menu_item.setAttribute("tabindex", `${index - initial_node_count}`)
                node_dropdown_content.appendChild(h5_dropdown_item);
            }
        })
        if (node_count <= initial_node_count) {
            node_dropdown_container.remove();
        }
    });
})

function getNode(node_id){
    const githubURL = "{{ node_registry_url }}";

    fetch(githubURL).then(resp => resp.json()).then(json => {

        const node_info = json[node_id];
        const node_keys = Object.keys(json);

        let image = document.getElementById("nodeImage");
        image.src = nodeImageBackground[node_keys.indexOf(node_id) % nodeImageBackground.length]
        Object.entries(node_info).forEach(([key, val]) => {
            const elem = document.getElementById(key);
            const converted_val = (converters[key] || converters["_default"])(val, node_info)
            if (elem !== null) {
                elem.replaceChildren(converted_val);
            }
        })

        let services_title = document.getElementById("servicesTitle");
        services_title.innerText = `Explore All Services by ${node_info["name"]}`;
    })
}
