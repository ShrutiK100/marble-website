function loadRegistry() {
    return fetch("{{ node_registry_url }}").then(resp => resp.json())
}

// {# raw section for rest of file so that template syntax is ignored since it is dynamically used by the javascript #}
// {% raw %}
function binNodes(registry, binSize) {
    const bins = [];
    Object.entries(registry).forEach(([key, val], index) => {
        if (index % binSize === 0) {
            bins.push({});
        }
        bins[bins.length - 1][key] = val;
    })
    return bins
}

function buildNodeDescription(name, data, node_index, row_id_suffix) {
    let node_id_suffix = `${row_id_suffix}-${node_index}`;
    const node_template = document.getElementById("link-description").cloneNode(true)
    let href = `node.html?node=${name}`;
    let img_src;
    let img_alt = `${name} icon`;
    data.links.forEach(link => {
        switch (link.rel) {
            case "icon":
                img_src = link.href;
                if ("alt" in link) {
                    img_alt = link.alt;
                }
                break
        }
    })

    node_template.innerHTML = node_template.innerHTML
        .replaceAll("{{href}}", href)
        .replace("{{title}}", name)
        .replace("{{content}}", data.description)
        .replaceAll("{{link_id}}", node_id_suffix);

    const image = node_template.content.getElementById(`link-image-${node_id_suffix}`)
    image.setAttribute("src", img_src);
    image.setAttribute("alt", img_alt);
    return node_template.content
}

function buildNodeContent(registry) {
    let row_container = document.getElementById("nodeContentDisplay");
    let id_suffix;
    binNodes(registry, 4).forEach((nodes, index) => {
        if (index === 1) {
            const accordion_container = document.getElementById("accordionContentDisplay");
            const accordion_template = document.getElementById("link-description-accordion-row").cloneNode(true);
            id_suffix = "nodes";
            accordion_template.innerHTML = accordion_template.innerHTML.replaceAll("{{accordion_id}}", id_suffix);
            accordion_container.appendChild(accordion_template.content);
            row_container = document.getElementById(`accordion-body-content-${id_suffix}`);
        }
        const row_template = document.getElementById("link-description-row").cloneNode(true);
        id_suffix = `nodes-${index}`;
        row_template.innerHTML = row_template.innerHTML.replaceAll("{{row_id}}", id_suffix);
        row_container.appendChild(row_template.content);
        let node_content = document.getElementById(`row-body-content-${id_suffix}`);

        Object.entries(nodes).forEach(([name, data], node_index) => {
            node_content.appendChild(buildNodeDescription(name, data, node_index, id_suffix));
            setNodeLinkURL(name, data, node_index, id_suffix);
        })
    })
}

function filterNodes(registry) {
    if (typeof nodeFilter === 'function') {
        return Object.fromEntries(Object.entries(registry).filter(nodeFilter));
    }
    return registry
}

function setNodeLinkURL(name, data, node_index, row_id_suffix){
    if (typeof setNodeLink === 'function') {
        let node_id_suffix = `${row_id_suffix}-${node_index}`;
        setNodeLink(name, data, node_id_suffix);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadRegistry().then(registry => filterNodes(registry)).then(registry => buildNodeContent(registry));
});
// {% endraw %}
