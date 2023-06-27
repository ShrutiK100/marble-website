//import exampleData from  "node_registry.js";
//const express = require('express');
//const app = express();
function getNodeRegistry(){
    //const fs = require('fs');
    //const https = require("https");
    //const request = require("request");
    const githubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_registry.json";
    const testGithubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_registry.schema.json";
    const jsonFile = "node_registry.json";
    let jsonData;
    let jsonContent;


    //Uncomment for getting json from github

    /*
    request(testGithubURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         jsonData = JSON.parse(body);
         buildHomePage(jsonData);


      }
    });
     */

  /*
            fetch('/')
            .then(response => {
                console.log(response);
                console.log(response.text());
                 return response.text();

            })
            .then(data => {//console.log(data);
                nodeContentDisplay.insertAdjacentHTML("beforeend", data)
            })
            .catch(err => console.log(err))
          */

    /*
    $.getJSON(testGithubURL), function(data){
        jsonData = JSON.parse(data);
        console.log(jsonData);
        //buildHomePage(jsonData);
    }
    return jsonData;

     */

/*$.getJSON("http://127.0.0.1:8080/horizon-update", callbackFuncWithData);

function callbackFuncWithData(data)
{
 // do some thing with data
}*/


    //Uncomment for reading json from local file
/*
    $.getJSON(jsonFile), function(data){
        jsonData = JSON.parse(data);
        console.log(jsonData);
        //buildHomePage(jsonData);
    }
    */

    //jsonContent = fs.readFileSync(jsonFile);
    //jsonData = JSON.parse(exampleData);
    //return jsonData

    fetch('js/node_registry.json').then(resp => resp.json()).then(resp => buildHomePage(resp));




}




function getNodeInfo(){
    const githubNodeInfoURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_info.json";
    var jsonData;

    //Uncomment for getting json from github
    /*
    return new Promise((resolve, reject) => {

        https.get(githubURL, (res) => {
          let data = '';
          res.on('data', (rd) => data = data + rd);
          res.on('end', () => resolve(data));
          res.on('error', reject);
        });

    });
    */

}



function getHTMLTemplate(folder, filename){
    //var fs = require('fs');

    //let templateContent = fs.readFileSync(folder + "/" + filename, 'utf8');
    let templateContent = fetch(folder + '/' + filename).then(resp => resp.text())

    //let template =  templateContent

    return templateContent;



}









function buildRowSectionHelper(jsonTreeSize, start, end, accordion){

    //let jsonTreeLength = Object.keys(jsonTreeSize).length;
    console.log("jsonTreeLength = "+ jsonTreeSize);
    console.log("accordion = " + accordion);

    if(accordion){
        fetch('templates/row-accordion-section-template.html').then(resp => resp.text()).then(rowTemplate => buildRowSection(jsonTreeSize, rowTemplate, start, end, accordion ));

    }
    else{
         fetch('templates/row-section-template.html').then(resp => resp.text()).then(rowTemplate => buildRowSection(jsonTreeSize, rowTemplate, start, end, accordion ));
    }

}











function buildRowSection(jsonTreeLength, template, start, end, accordion){
    let rowNum = 0;
    let rowSectionTemplate = "";
    let rowAccordionSectionTemplate = '';
    let nodeAccordionSectionTemplate = '';
    let finalRowHTML = "";
    let accordionID = "";
    let accordionHeaderID = "";
    let accordionCollapseID = "";
    let rowSection = "";
    let rowIntroSectionTemplate = "";
    let innerRowContentDiv = document.createElement("template");



    if(accordion){
        //rowAccordionSectionTemplate = getHTMLTemplate('../templates', 'row-accordion-section-template.html');
        /*
        rowAccordionSectionTemplate = template;
        accordionID = "accordion" + (1);
        accordionHeaderID = "accordionHeader" + (1);
        accordionCollapseID = "accordionCollapse" + (1);

        rowSection = rowAccordionSectionTemplate.replaceAll("{{ACCORDION_ID}}", accordionID );
        rowSection = rowSection.replaceAll("{{ACCORDION_HEADER_ID}}", accordionHeaderID);
        rowSection = rowSection.replaceAll("{{ACCORDION_COLLAPSE_ID}}", accordionCollapseID);
        */

        if (jsonTreeLength > 4) {

            rowNum = jsonTreeLength / 4

            for(let x = 0; x < rowNum; x++){
                //rowAccordionSectionTemplate = getHTMLTemplate('../templates', 'row-accordion-section-template.html');
                rowAccordionSectionTemplate = template;
                accordionID = "accordion" + (x+1);
                accordionHeaderID = "accordionHeader" + (x+1);
                accordionCollapseID = "accordionCollapse" + (x+1);

                rowSection = rowAccordionSectionTemplate.replaceAll("{{ACCORDION_ID}}", accordionID );
                rowSection = rowSection.replaceAll("{{ACCORDION_HEADER_ID}}", accordionHeaderID);
                rowSection = rowSection.replaceAll("{{ACCORDION_COLLAPSE_ID}}", accordionCollapseID);



            }
            finalRowHTML = finalRowHTML + rowSection;

        }
        else{
            for(let y = 0; y < jsonTreeLength; y ++){
                //rowAccordionSectionTemplate = getHTMLTemplate('../templates', 'row-accordion-section-template.html');
                rowAccordionSectionTemplate = template;
                accordionID = "accordion" + (y+1);
                accordionHeaderID = "accordionHeader" + (y+1);
                accordionCollapseID = "accordionCollapse" + (y+1);

                rowSection = rowAccordionSectionTemplate.replaceAll("{{ACCORDION_ID}}", accordionID );
                rowSection = rowSection.replaceAll("{{ACCORDION_HEADER_ID}}", accordionHeaderID);
                rowSection = rowSection.replaceAll("{{ACCORDION_COLLAPSE_ID}}", accordionCollapseID);

            }
            finalRowHTML = finalRowHTML + rowSection;

        }


    }
    else{
        //rowIntroSectionTemplate = getHTMLTemplate('../templates', 'row-section-template.html');
        rowIntroSectionTemplate = template;
        rowSection = rowIntroSectionTemplate.replace("{{NODE_INTRO_ROW_ID}}", "introRow" + start);
        rowSection = rowSection.replace("{{NODE_CONTENT_CELL_ID}}", "introRowNodeGroup" + start);
        finalRowHTML = finalRowHTML + rowSection;


    }

    //console.log(finalRowHTML);
    innerRowContentDiv.innerHTML = finalRowHTML;
    const elem = document.getElementById('nodeContentDisplay');
    elem.appendChild(innerRowContentDiv.content);
	//elem.innerHTML = finalRowHTML;

    //return rowSection;

}





function buildNodeSectionHelper(jsonTree, start, end, accordion){
    let jsonTreeSize = Object.keys(jsonTree).length;
    let accordionBodyRow;

    let rowIndex = start / 4;
    let divRowContainer;
    let divRowPT5;
    let divColLg2_1;
    let divColLg2_2;
    let divColLg2_3;

    const testElem = document.getElementById('introRow0');
    console.log("introrow0 = " + testElem);
/*
    <div className="container">
        <div className="row pt-5" id="{{NODE_INTRO_ROW_ID}}">
            <div className="col-lg-2"></div>
            <div className="col-lg-2" id="{{NODE_CONTENT_CELL_ID}}"></div>

            <div className="col-lg-2"></div>

        </div>
        <!-- End inner row for DACCS node row 1 -->
    </div>
    */

    //ew_row.className = "aClassName";
    //g = document.createElement('div');
    // g.setAttribute("id", "Div1");

    //document.querySelector('[id*="MobileAreaCode"]');


    // if(jsonTreeSize < 5){
    divRowContainer = document.createElement("div");
    divRowContainer.className = "container";

    divRowPT5 = document.createElement("div");
    divRowPT5.className = "row pt-5";
    divRowPT5.setAttribute("id", "nodeGroupRow" + rowIndex );

    divRowContainer.appendChild(divRowPT5);

    divColLg2_1 = document.createElement("div");
    divColLg2_1.className = "col-lg-2";


    divColLg2_2 = document.createElement("div");
    divColLg2_2.className = "col-lg-2";
    divColLg2_2.setAttribute("id","nodeGroupContent" + rowIndex);


    divColLg2_3 = document.createElement("div");
    divColLg2_3.className = "col-lg-2";

    divRowPT5.appendChild(divColLg2_1);
    divRowPT5.appendChild(divColLg2_2);
    divRowPT5.appendChild(divColLg2_3);

   if(accordion){
        accordionBodyRow = document.getElementById("ACCORDION_BODY_CONTENT");
        accordionBodyRow.appendChild(divRowContainer);
    }
   else{
       let staticBodyRow = document.getElementById("introRowNodeGroup0" );
       staticBodyRow.appendChild(divRowContainer);

   }



   fetch('templates/node-section-template.html').then(resp => resp.text()).then(nodeTemplate => buildNodeSection(jsonTree, nodeTemplate, start, end, rowIndex));






/*
    }
    else{

        let rowNum = jsonTreeSize / 4;

        for(let j = 0; j < rowNum; j++){

            divRowContainer = document.createElement("div");
            divRowContainer.className = "container";

            divRowPT5 = document.createElement("div");
            divRowPT5.className = "row pt-5";
            divRowPT5.setAttribute("id", "nodeGroupRow" + j );

            divRowContainer.appendChild(divRowPT5);

            divColLg2_1 = document.createElement("div");
            divColLg2_1.className = "col-lg-2";


            divColLg2_2 = document.createElement("div");
            divColLg2_2.className = "col-lg-2";
            divColLg2_2.setAttribute("id","nodeGroupContent" + j);


            divColLg2_3 = document.createElement("div");
            divColLg2_3.className = "col-lg-2";

            divRowPT5.appendChild(divColLg2_1);
            divRowPT5.appendChild(divColLg2_2);
            divRowPT5.appendChild(divColLg2_3);

            accordionBodyRow.appendChild(divRowContainer);

           fetch('templates/node-section-template.html').then(resp => resp.text()).then(nodeTemplate => buildRowSection(jsonTreeSize, nodeTemplate, start, end, accordion ));


        }

    }
    */



}



function buildNodeSection(jsonTree, template, start, end, rowIndex){
    let divElem;
    let nodeSectionTemplate = '';


    let rowSectionTemplate = '';
    let nodeAccordionSectionTemplate = '';
    let rowAccordionSectionTemplate = '';
    let rowAccordionContent = "";
    let nodeSection = "";
    let rowAccordionSection = "";
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

    let nodeContentInnerDiv = document.createElement("template");


    for (let t = start; t < end; t++){

        //nodeSectionTemplate = getHTMLTemplate('../templates', 'node-section-template.html');
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

    divElem  = document.getElementById("nodeGroupContent" + rowIndex);
    nodeContentInnerDiv.innerHTML = finalHTML;
    divElem.appendChild(nodeContentInnerDiv.content);

    //return finalHTML

}








function buildNodeContent(jsonTree){


    let rowNum = 0;

    let nodeGroupHTML = "";
    let nodeRowRemainderHTML = "";
    let rowShellHTML = "";
    let accordionRowHTML = "";
    let nodeSectionHTML = "";
    let innerRowHTML = "";

    let nodeAccordionRow = "";

    let nodeInnerContent = "";
    let nodeAccordionInnerRowHTML = "";
    let innerNodeGroupHTML = "";
    let accordionInnerShellRowHTML = "";
    let nodeIntroRow = "";
    let nodeIntroGroup = "";
    let nodeIntroContentRow  = "";



    let remainderInnerShellRow = "";
    let remainderNodeGroup = "";
    let remainderInnerRowHTML  = "";

    let nodeContent = "";
    let nodeContentDiv;


    let jsonTreeSize = Object.keys(jsonTree).length;


    if (jsonTreeSize < 5){

        //rowShellHTML = buildRowSectionHelper(jsonTreeSize,0,4, false);
        //nodeGroupHTML = buildNodeSection(jsonTree, 0, 4);
        buildRowSectionHelper(jsonTreeSize,0,4, false);
        buildNodeSectionHelper(jsonTree, 0, 4, false);



        //nodeContentDiv = document.getElementById("nodeContentDisplay");

        //nodeContentDiv.innerHTML = nodeGroupHTML;

        //nodeIntroRow = rowShellHTML.replace('NODE_GROUP', nodeGroupHTML);


    }
    else{


        //Build first row (static)
        //rowShellHTML = buildRowSectionHelper(jsonTreeSize,0,4, false);
        buildRowSectionHelper(jsonTreeSize,0,4, false);
        buildNodeSectionHelper(jsonTree, 0, 4, false);


        //nodeGroupHTML = buildNodeSection(jsonTree, 0, 4);

        //nodeIntroRow = rowShellHTML.replace("NODE_GROUP", nodeGroupHTML);

        //accordionRowHTML = buildRowSectionHelper(jsonTreeSize, 0, 4,true );
        buildRowSectionHelper(jsonTreeSize, 0, 4,true );


        //Build all other rows for the accordion section
        //Inner rows of accordion section are non-accordion
        for(let n = 4; n < (jsonTreeSize - (jsonTreeSize % 4)); n += 4 ){


            //accordionInnerShellRowHTML = buildRowSectionHelper(jsonTreeSize, n, (n + 4), false);
            //buildRowSectionHelper(jsonTreeSize, n, (n + 4), false);
            //innerNodeGroupHTML = buildNodeSection(jsonTree, n, (n + 4));

            //nodeAccordionInnerRowHTML = accordionInnerShellRowHTML.replace("NODE_GROUP", innerNodeGroupHTML);
            //nodeInnerContent = nodeInnerContent + nodeAccordionInnerRowHTML;


            buildNodeSectionHelper(jsonTree, 0, 4, true);




            //nodeContentDiv = document.getElementById("nodeContentDisplay");

            //nodeContentDiv.innerHTML = nodeGroupHTML;




        }

        if(jsonTreeSize % 4 > 0){

            buildRowSectionHelper(jsonTreeSize,  (jsonTreeSize - (jsonTreeSize % 4)), jsonTreeSize, false );
            buildNodeSectionHelper(jsonTree, (jsonTreeSize - (jsonTreeSize % 4)), jsonTreeSize, false);
            //remainderInnerShellRow = buildRowSectionHelper(jsonTreeSize,  (jsonTreeSize - (jsonTreeSize % 4)), jsonTreeSize, false );
            //remainderNodeGroup = buildNodeSection(jsonTree, (jsonTreeSize - (jsonTreeSize % 4)), jsonTreeSize);
            //remainderInnerRowHTML = remainderInnerShellRow .replace("NODE_GROUP", remainderNodeGroup);
            //nodeInnerContent = nodeInnerContent + remainderInnerRowHTML;
        }

        //nodeAccordionRow = accordionRowHTML.replace("ACCORDION_BODY_CONTENT", nodeInnerContent);



    }

    //nodeContent = nodeIntroRow + nodeAccordionRow;

    //return nodeContent;


}














function saveHTML(filepath, filename, content){

    const fs = require('fs');




    fs.writeFile(filepath +'/' + filename, content, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });

}





function buildHomePage(jsonTree){
    //When getting json from github add jsonTree as a function parameter

    //Comment out when getting json from github
   // let jsonTree

    let homepage = "";
    let homepageTemplate = "";
    let nodeContent = "";
    //const html = require("html");
    let jsonTreeSize = Object.keys(jsonTree).length;

    /*
    if(jsonTreeSize < 5){

        fetch('templates/row-section-template.html').then(resp => resp.text()).then(template => buildNodeContent(jsonTree, template ));

    }
    else{

    }*/



    //Comment out when getting json from github
    //jsonTree = getNodeRegistry();
    buildNodeContent(jsonTree);
    //nodeContent = buildNodeContent(jsonTree);

    //homepageTemplate = getHTMLTemplate("../templates", "index-template.html");

    //homepageTemplate = homepageTemplate.replace("NODE_CONTENT", nodeContent);
    //homepage = html.prettyPrint(homepageTemplate, {indent_size:2});
    //homepage = homepageTemplate;


    //saveHTML("..", "index.html", homepage);


    //return homepage;
    //return nodeContent;

}



async function testGetNodeRegistry(){
    let jsonTree
    let homepage = "";
    let homepageTemplate = "";
    let nodeContent = "";
    const html = require("html");


    let dynamicNodeContent = await getNodeRegistry();
    //console.log(dynamicNodeContent);
    homepageTemplate = getHTMLTemplate("../templates", "index-template.html");
    //nodeContent = buildNodeContent(jsonTree);

    //homepageTemplate = homepageTemplate.replace("NODE_CONTENT", nodeContent);
    homepage = html.prettyPrint(homepageTemplate, {indent_size:2});

    return homepage;
}



function readFileTest(){
    var reader = new FileReader();
    let content = reader.readAsText("../templates/row-section-template.html");
    console.log(content);
}




function main(){

    //buildHomePage();

   // let testJSON;

   // testJSON = testGetNodeRegistry();

    //Uncomment when going live
    //let dynamicNodeContent =  getNodeRegistry();
    //testJSON = dynamicNodeContent.then(function(result) {

   //console.log(result) // "Some User token"

    //});



    //console.log(dynamicNodeContent);

    let dynamicNodeContent = buildHomePage();
    console.log(dynamicNodeContent);
    return dynamicNodeContent;



}

//main();
//getNodeRegistry();
//readFileTest();

function testJSON(jsonContent){
console.log(jsonContent);
}


document.addEventListener("DOMContentLoaded", function(){
	let x=10;
    //fetch('js/node_registry.json').then(resp => resp.json()).then(resp => testJSON(resp))
    //fetch('templates/row-section-template.html').then(resp => resp.text()).then(jsonTree => buildHomePage(jsonTree))

    getNodeRegistry();

});