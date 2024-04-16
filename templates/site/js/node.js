const converters = {
    "_default": (val) => val,
    "contact": (val) => {
        mailto_link = document.createElement("a")
        mailto_link.setAttribute("href", `mailto:${val}`)
        mailto_link.classList.add("undecorated-link")
        mailto_link.innerText = val
        return mailto_link
    },
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
            const node_card_template = document.getElementById("node-card-template")
            const node_card = node_card_template.content.cloneNode(true);

            const name_elem = node_card.getElementById("node-card-template-name")
            const desc_elem = node_card.getElementById("node-card-template-description")
            const link_elem = node_card.getElementById("node-card-template-link")
            const doc_elem = node_card.getElementById("node-card-template-doc")

            name_elem.innerText = service.name
            desc_elem.innerText = service.description
            service.links.forEach(link => {
                if (link.rel === "service") {
                    Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value));
                } else if (link.rel === "service-doc") {
                    Object.entries(link).forEach(([attr, value]) => doc_elem.setAttribute(attr, value));
                }
            })
            services_row.appendChild(node_card)
        })
        return services_row
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
