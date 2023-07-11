function getNodeRegistry(){

    const githubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_registry.json";
    const testGithubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_registry.schema.json";
    const jsonFile = "js/node_registry.json";

    //Uncomment for getting json from github

    fetch(githubURL).then(resp => resp.json()).then(resp => buildHomePage(resp));


    //Uncomment for reading json from local file

    //fetch(jsonFile).then(resp => resp.json()).then(resp => buildHomePage(resp));


}

function getNodeInfo(){
    const githubNodeInfoURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_info.json";

    //Uncomment for getting json from github
  /*
    fetch(githubNodeInfoURL).then(resp => resp.json()).then(resp => buildHomePage(resp));
     */

}

//Fetches the appropriate template according to accordion status and passes it on to the buildRowSection function
function buildRowSectionHelper(jsonTree, jsonTreeSize, start, end, accordion){

    if(accordion){
        fetch('templates/row-accordion-section-template.html').then(resp => resp.text()).then(rowTemplate => buildRowSection(jsonTree, jsonTreeSize, rowTemplate, start, end, accordion ));
    }
    else{
         fetch('templates/row-section-template.html').then(resp => resp.text()).then(rowTemplate => buildRowSection(jsonTree, jsonTreeSize, rowTemplate, start, end, accordion ));
    }
}

//Builds a row section according to accordion status.
//Adds the row section to the div with ID nodeContentDisplay
//Calls nodeSectionHelper to build the node content
function buildRowSection(jsonTree, jsonTreeLength, template, start, end, accordion){

    let rowAccordionSectionTemplate = '';
    let finalRowHTML = "";
    let accordionID = "";
    let accordionHeaderID = "";
    let accordionCollapseID = "";
    let rowSection = "";
    let rowIntroSectionTemplate = "";
    let innerRowContentDiv = document.createElement("template");

    if(accordion){

        rowAccordionSectionTemplate = template;
        accordionID = "accordion" + 1;
        accordionHeaderID = "accordionHeader" + 1;
        accordionCollapseID = "accordionCollapse" + 1;

        rowSection = rowAccordionSectionTemplate.replaceAll("{{ACCORDION_ID}}", accordionID );
        rowSection = rowSection.replaceAll("{{ACCORDION_HEADER_ID}}", accordionHeaderID);
        rowSection = rowSection.replaceAll("{{ACCORDION_COLLAPSE_ID}}", accordionCollapseID);
        finalRowHTML = finalRowHTML + rowSection;

        innerRowContentDiv.innerHTML = finalRowHTML

        const elem = document.getElementById('accordionContentDisplay');
        elem.appendChild(innerRowContentDiv.content);
    }
    else{

        rowIntroSectionTemplate = template;
        rowSection = rowIntroSectionTemplate.replace("{{NODE_INTRO_ROW_ID}}", "introRow" + start);
        rowSection = rowSection.replace("{{NODE_CONTENT_CELL_ID}}", "introRowNodeGroup" + start);
        finalRowHTML = finalRowHTML + rowSection;

        innerRowContentDiv.innerHTML = finalRowHTML;
        const elem = document.getElementById('nodeContentDisplay');
        elem.appendChild(innerRowContentDiv.content);
    }

    buildNodeSectionHelper(jsonTree, start, end, template, accordion)

}

//Builds out the row to contain the node content
//Calls buildNodeSection to create the node content
function buildNodeSectionHelper(jsonTree, start, end, rowTemplate, accordion){
    let jsonTreeSize = Object.keys(jsonTree).length;
    let rowNum;
    let rowRemainder;
    let rowIndex = start / 4;
    let divRowContainer;
    let divRowPT5;
    let divColLg2_1;
    let divColLg2_2;
    let divColLg2_3;
    let singleColumnDiv;
    let remainderIndex;
    let staticBodyDiv;
    let accordionBodyDiv;
    let nodeGroupRow;
    let bufferColumn;

    rowNum = Math.floor(jsonTreeSize / 4);
    rowRemainder = Math.floor(jsonTreeSize % 4);

    bufferColumn = document.createElement("div");
    bufferColumn.className = "col-lg-2";

    if(accordion){
        for(let t = 0; t < rowNum; t++){
            nodeGroupRow = document.createElement("div");
            nodeGroupRow.setAttribute("id", "nodeGroupRow" + t);

            divRowContainer = document.createElement("div");
            divRowContainer.className = "container";

            divRowPT5 = document.createElement("div");
            divRowPT5.classList.add('row', 'pt-5', 'row-cols-1', 'row-cols-lg-4');
            divRowPT5.setAttribute("id", "accordionInnerRow" + t);

            divRowContainer.appendChild(divRowPT5);

            divColLg2_1 = document.createElement("div");
            divColLg2_1.className = "col-lg-2";

            divColLg2_2 = document.createElement("div");
            divColLg2_2.setAttribute("id","accordionNodeContent" + t );

            divColLg2_3 = document.createElement("div");
            divColLg2_3.className = "col-lg-2";

            accordionBodyDiv = document.getElementById("ACCORDION_BODY_CONTENT");

            accordionBodyDiv.appendChild(divRowContainer);
        }

        if(rowRemainder > 0){
            remainderIndex = rowNum + 1;

            nodeGroupRow = document.createElement("div");
            nodeGroupRow.setAttribute("id", "nodeGroupRow"  + remainderIndex);

            divRowContainer = document.createElement("div");
            divRowContainer.className = "container";

            divRowPT5 = document.createElement("div");
            divRowPT5.classList.add('row', 'pt-5', 'row-cols-1', 'row-cols-lg-4');

            divRowPT5.setAttribute("id", "accordionInnerRow" + remainderIndex);

            divRowContainer.appendChild(divRowPT5);

            divColLg2_1 = document.createElement("div");
            divColLg2_1.className = "col-lg-2";

            divColLg2_2 = document.createElement("div");
            divColLg2_2.setAttribute("id","accordionNodeContent" + remainderIndex );

            divColLg2_3 = document.createElement("div");
            divColLg2_3.className = "col-lg-2";

            accordionBodyDiv = document.getElementById("ACCORDION_BODY_CONTENT");

            accordionBodyDiv.appendChild(divRowContainer);
        }

    }
    else
    {
        nodeGroupRow = document.createElement("div");
        nodeGroupRow.setAttribute("id", "nodeGroupRowStatic");

        divRowContainer = document.createElement("div");
        divRowContainer.className = "container";

        divRowPT5 = document.createElement("div");
        divRowPT5.classList.add('row', 'pt-5', 'row-cols-1', 'row-cols-lg-4');
        divRowPT5.setAttribute("id", "staticNodeRow" );

        divRowContainer.appendChild(divRowPT5);

        divColLg2_1 = document.createElement("div");
        divColLg2_1.className = "col-lg-2";

        divColLg2_2 = document.createElement("div");
        divColLg2_2.className = "col-lg-2";


        divColLg2_3 = document.createElement("div");
        divColLg2_3.className = "col-lg-2";

        singleColumnDiv = document.createElement("div");
        singleColumnDiv.className = "col-lg-1";

        staticBodyDiv = document.getElementById("introRow0");

        if(end < 4){
            staticBodyDiv.appendChild(singleColumnDiv);

        }

    }

    fetch('templates/node-section-template.html').then(resp => resp.text()).then(nodeTemplate => buildNodeSection(jsonTree, nodeTemplate, bufferColumn, start, end, rowIndex, accordion));

}

//Creates containing rows for the node content
//Calls buildNodeGroup to create the node content
//Adds the node content to the containing rows
function buildNodeSection(jsonTree, template, bufferColumn, start, end, rowIndex, accordion){
    let jsonTreeSize = Object.keys(jsonTree).length;
    let accordionNodeContentCell;
    let staticNodeContentCell;
    let nodeGroup;
    let accordionNodeGroupStart;
    let accordionNodeGroupEnd;
    let nodeContentInnerTemplate = document.createElement("template");
    let rowNum = Math.floor(jsonTreeSize / 4);
    let rowRemainder = Math.floor(jsonTreeSize % 4);

    if(accordion){
        accordionNodeGroupStart =  4;
        for(let n = 1; n< rowNum; n++){
            accordionNodeGroupEnd = accordionNodeGroupStart + 4;
            nodeGroup = buildNodeGroup(jsonTree, template, accordionNodeGroupStart, accordionNodeGroupEnd, rowIndex, accordion);
            nodeContentInnerTemplate.innerHTML = nodeGroup;
            accordionNodeContentCell = document.getElementById("accordionInnerRow" + n);
            accordionNodeContentCell.append(bufferColumn);
            accordionNodeContentCell.append(nodeContentInnerTemplate.content);
            accordionNodeContentCell.append(bufferColumn);
            accordionNodeGroupStart  = accordionNodeGroupStart + 4
        }
        if(rowRemainder > 0){
            nodeGroup = buildNodeGroup(jsonTree, template, (jsonTreeSize - rowRemainder),jsonTreeSize , rowIndex, accordion);
            nodeContentInnerTemplate.innerHTML = nodeGroup;
            accordionNodeContentCell = document.getElementById("accordionInnerRow" + (rowNum + 1));
            accordionNodeContentCell.append(bufferColumn);
            accordionNodeContentCell.append(nodeContentInnerTemplate.content);
            accordionNodeContentCell.append(bufferColumn);
        }
    }
    else {
        nodeGroup = buildNodeGroup(jsonTree, template, 0, end, rowIndex, accordion);
        nodeContentInnerTemplate.innerHTML = nodeGroup;
        staticNodeContentCell = document.getElementById("introRow0"  );
        staticNodeContentCell.appendChild(nodeContentInnerTemplate.content);

        if(end > 4){
            staticNodeContentCell.appendChild(bufferColumn);
        }

    }
}

//Creates the node content
//Goes through the json tree and gets the node name and node details to fill in the node content template
//Returns an HTML string consisting of 4 node descriptions
function buildNodeGroup(jsonTree, template, start, end, rowIndex, accordion){

    let nodeSectionTemplate = '';
    let nodeSection = "";
    let finalHTML = "";
    let nodeContentID = "" ;
    let nodeLogoColumnID = "" ;
    let nodeLinkImgID = "" ;
    let nodeLogoID = "" ;
    let nodeDescriptionColumnID = "";
    let nodeLinkTextID = "" ;
    let nodeNameID = "" ;
    let nodeLinkDescriptionID = "" ;
    let nodeDescriptionID = "" ;
    let nodeLinkID = "" ;
    let nodeName = "";
    let nodeURL = "";
    let nodeAffiliation = "";
    let nodeDescription = "";
    let nodeIconURL = "";
    let nodeLocation = "";
    let nodeContact = "";
    let nodeServices = "";
    let nodeLastUpdated = "";
    let nodeVersion = "";
    let nodeStatus = "";
    let nodeSectionContent = "";

    for (let t = start; t < end; t ++){

        nodeSectionTemplate = template;
        nodeContentID = "nodeContent" + t;
        nodeLogoColumnID = "nodeLogoColumn" + t;
        nodeLinkImgID = "nodeLinkImg" + t;
        nodeLogoID = "nodeLogo" + t;
        nodeDescriptionColumnID = "nodeDescriptionColumn" + t;
        nodeLinkTextID = "nodeLinkText" + t;
        nodeNameID = "nodeName" + t;
        nodeLinkDescriptionID = "nodeLinkDescription" + t;
        nodeDescriptionID = "nodeDescription" + t;
        nodeLinkID = "nodeLink" + t;
        nodeName = Object.keys(jsonTree)[t];
        nodeURL = jsonTree[nodeName].url;
        nodeAffiliation = jsonTree[nodeName].affiliation;
        nodeDescription = jsonTree[nodeName].description;
        nodeIconURL = jsonTree[nodeName].icon_url;
        nodeLocation = jsonTree[nodeName].location;
        nodeContact = jsonTree[nodeName].contact;
        nodeServices = jsonTree[nodeName].services;
        nodeLastUpdated = jsonTree[nodeName].last_updated;
        nodeVersion = jsonTree[nodeName].version;
        nodeStatus = jsonTree[nodeName].status;

        nodeSectionContent = nodeSectionTemplate.replaceAll("{{NODE_CONTENT_ID}}", nodeContentID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_LOGO_COLUMN_ID}}", nodeLogoColumnID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_LINK_IMG_ID}}", nodeLinkImgID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_LOGO_ID}}", nodeLogoID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_DESCRIPTION_COLUMN_ID}}", nodeDescriptionColumnID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_LINK_TEXT_ID}}", nodeLinkTextID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_NAME_ID}}", nodeNameID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_LINK_DESC_ID}}", nodeLinkDescriptionID);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_DESCRIPTION_ID}}", nodeDescriptionID);
        nodeSectionContent = nodeSectionContent.replaceAll("{{NODE_HREF}}", nodeURL);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_LOGO_PATH}}", nodeIconURL);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_NAME}}", nodeName);
        nodeSectionContent = nodeSectionContent.replace("{{NODE_DESCRIPTION}}", nodeDescription);

        nodeSection = nodeSection + nodeSectionContent;

    }

    finalHTML = nodeSection;
    return finalHTML;

}

function buildHomePage(jsonTree){
    let end = 0;
    let jsonTreeSize = Object.keys(jsonTree).length;

    if (jsonTreeSize/4 > 1){
        end = 4;
    }
    else{
        end = jsonTreeSize
    }

    if (jsonTreeSize < 5){
        buildRowSectionHelper(jsonTree, jsonTreeSize,0,end, false);
    }
    else{
        buildRowSectionHelper(jsonTree, jsonTreeSize,0,end, false);
        buildRowSectionHelper(jsonTree, jsonTreeSize, 0, end,true );
    }
}

document.addEventListener("DOMContentLoaded", function(){

    getNodeRegistry();

});