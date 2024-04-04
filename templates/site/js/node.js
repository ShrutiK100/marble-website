const converters = {
    "_default": (val) => val,
    "name":(val)=>{
        let node_name = document.getElementById('name');
        node_name.innerHTML = val;
    },
    "affiliation": (val) => {
        //let title_affiliation = document.createElement("div");
        let title_affiliation = document.getElementById('affiliation');
        title_affiliation.innerHTML = val;
        //return title_affiliation;
    },
    "description": (val) => {
        //let node_description_title = document.createElement("div");
        let node_description_title = document.getElementById('description');
        node_description_title.innerHTML = val;
        //return node_description_title;
    },
    "registration_status": (val) => {
        //let registration_status_title = document.createElement("div");
        let registration_status_title = document.getElementById('registration_status');
        registration_status_title.innerText = "Registration Status: " + val;
        registration_status_title.classList.add("registration-status-title");
        //return registration_status_title;
    },
    "contact": (val) => {
        //let contact_email = document.createElement("div");
        let contact_email = document.getElementById('contact');
        contact_email.href = "mailto:" + val;
        contact_email.innerText = val;
        //return contact_email;
    },
    "date_added": (val) => {
        //let date_added = document.createElement("div")
        let date_added = document.getElementById('date_added');
        date_added.innerText = val;
        //return date_added
        //new Date(val).toLocaleDateString("en-GB")
    },
    "location": (val) => {
        let node_location = document.createElement("div");
        node_location.innerText = `latitude: ${val.latitude} longitude: ${val.longitude}`;
        //return node_location;

    },
    "version":(val) => {
        //let node_version = document.createElement("div");
        let node_version = document.getElementById('version');
        node_version.innerText = "Version " + val;
       // return node_version;

    },
    "status":(val) =>{
        let node_status = document.getElementById('status');
        node_status.innerText = val;
        //return node_status;
    },
    "services": (val) => {

        const services_row = document.createElement("div")
        services_row.id = "nodeServices";
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
        let services_div = document.getElementById("services");
        services_div.innerHTML = "";
        services_div.append(services_row);
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


        //If number of nodes larger than 3, create a menu with the first 3 nodes, and create a dropdown from node 4 and up
        //If not, just create a menu with the nodes in the node registry
        if(node_count > 3){
            for(let i = 0; i<=2; i++){
                const node_menu_item = document.createElement('a');
                node_menu_item.setAttribute('onclick','getNode(' + '"'+ node_keys[i] +'"' + ')');
                node_menu_item.innerText = json[node_keys[i]].name;

                if (menu_elem !== null) {
                menu_elem.append(node_menu_item);
                }
            }

            for(let i=3; i<=node_count-1; i++){
                const dropdown_item = document.createElement('option')
                dropdown_item.value =  node_keys[i];
                dropdown_item.innerHTML = json[node_keys[i]].name;
                node_menu_dropdown.append(dropdown_item);

                node_menu_dropdown.setAttribute('onchange', 'getNode(' + '"'+ node_keys[i] +'"' + ')');
            }

            if (menu_elem !== null) {
                menu_elem.append(node_menu_dropdown);
            }
        }
        else{

            node_keys.forEach(key =>{
                const node_menu_item = document.createElement('a');
                node_menu_item.setAttribute('onclick','getNode(' + '"'+ key +'"' + ')');
                node_menu_item.innerText = json[key].name;

                if (menu_elem !== null) {
                menu_elem.append(node_menu_item);
                }

            });
            /*
            for(let i = 0; i<=2; i++){
                const node_menu_item = document.createElement('a');
                node_menu_item.setAttribute('onclick','getNode(' + '"'+ node_keys[i] +'"' + ')');
                node_menu_item.innerText = json[node_keys[i]].name;

                if (menu_elem !== null) {
                menu_elem.append(node_menu_item);
                }
            }*/
        }



    });
})

function getNode(node_name){
    const githubURL = "{{ node_registry_url }}";

    fetch(githubURL).then(resp => resp.json()).then(json => {
        const node_info = json[node_name];

         Object.entries(node_info).forEach(([key, val]) => {
                const elem = document.getElementById(key);

                if (elem !== null) {
                    elem.append((converters[key] || converters["_default"])(val));
                }
            })



        node_info.links.forEach(link => {
            if (link.rel === "service") {
                const node_url = document.getElementById("url");
                node_url.innerHTML = "";
                const link_elem = document.createElement("a");

                Object.entries(link).forEach(([attr, value]) => link_elem.setAttribute(attr, value));
                link_elem.innerText = link.href;
                node_url.appendChild(link_elem);
            } else if (link.rel === "icon") {
                const icon_img = document.createElement("img")
                icon_img.setAttribute("src", link.href)

                const image_right = document.getElementById("image-right")
                if(image_right) {
                    image_right.setAttribute("src", link.href);
                }
            } else if (link.rel === "registration"){
                if(node_info.registration_status != "closed"){
                    let node_registration_link = document.createElement("a");
                    let registration_link_div = document.getElementById("registration_link");
                    registration_link_div.innerHTML = "";
                    node_registration_link.setAttribute("href", link.href)
                    node_registration_link.setAttribute("target", "_blank")
                    node_registration_link.innerText = "Sign up for an account on this node";
                    registration_link_div.appendChild(node_registration_link);
                }
            }
        })

    });

};