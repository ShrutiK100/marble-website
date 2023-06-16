

function getNodeRegistry(){
    var fs = require('fs');
    const https = require("https");
    const githubURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_registry.schema.json";
    const jsonFile = "node_registry.json";
    var jsonData;
    let jsonContent;


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




    //Uncomment for reading json from local file
    jsonContent = fs.readFileSync(jsonFile);
    jsonData = JSON.parse(jsonContent);
    return jsonData



}




function getNodeInfo(){
    const githubNodeInfoURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_info.json";
    var jsonData;

    request(githubNodeInfoURL, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         jsonData = JSON.parse(body);
         //console.log(jsonData);
         buildNodeContent(jsonData);

      }
      else
      {
          console.log(error);
      }
    })
}



function getHTMLTemplate(folder, filename){
    var fs = require('fs');

    let templateContent = fs.readFileSync(folder + "/" + filename, 'utf8');


    return templateContent;



}



function buildRowSection(jsonTreeLength, start, end, accordion){
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


    if(accordion){
        if (jsonTreeLength > 4) {

            rowNum = jsonTreeLength / 4

            for(let x = 0; x < rowNum; x++){
                rowAccordionSectionTemplate = getHTMLTemplate('../templates', 'row-accordion-section-template.html');
                accordionID = "accordion" + (x+1);
                accordionHeaderID = "accordionHeader" + (x+1);
                accordionCollapseID = "accordionCollapse" + (x+1);

                rowSection = rowAccordionSectionTemplate.replaceAll("ACCORDION_ID", accordionID );
                rowSection = rowSection.replaceAll("ACCORDION_HEADER_ID", accordionHeaderID);
                rowSection = rowSection.replaceAll("ACCORDION_COLLAPSE_ID", accordionCollapseID);

            }

        }
        else{
            for(let y = 0; y < jsonTreeLength; y ++){
                rowAccordionSectionTemplate = getHTMLTemplate('../templates', 'row-accordion-section-template.html');
                accordionID = "accordion" + (y+1);
                accordionHeaderID = "accordionHeader" + (y+1);
                accordionCollapseID = "accordionCollapse" + (y+1);

                rowSection = rowAccordionSectionTemplate.replaceAll("ACCORDION_ID", accordionID );
                rowSection = rowSection.replaceAll("ACCORDION_HEADER_ID", accordionHeaderID);
                rowSection = rowSection.replaceAll("ACCORDION_COLLAPSE_ID", accordionCollapseID);
            }

        }

    }
    else{
        rowIntroSectionTemplate = getHTMLTemplate('../templates', 'row-section-template.html');
        rowSection = rowIntroSectionTemplate.replace("NODE_INTRO_ROW_ID", "introRow" + start);


    }


    return rowSection;

}




function buildNodeSection(jsonTree, start, end){
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


    for (let t = start; t < end; t++){

        nodeSectionTemplate = getHTMLTemplate('../templates', 'node-section-template.html');


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



        nodeSectionContent = nodeSectionTemplate.replaceAll("NODE_CONTENT_ID", nodeContentID);
        nodeSectionContent = nodeSectionContent.replace("NODE_LOGO_COLUMN_ID", nodeLogoColumnID);
        nodeSectionContent = nodeSectionContent.replace("NODE_LINK_IMG_ID", nodeLinkImgID);
        nodeSectionContent = nodeSectionContent.replace("NODE_LOGO_ID", nodeLogoID);
        nodeSectionContent = nodeSectionContent.replace("NODE_DESCRIPTION_COLUMN_ID", nodeDescriptionColumnID);
        nodeSectionContent = nodeSectionContent.replace("NODE_LINK_TEXT_ID", nodeLinkTextID);
        nodeSectionContent = nodeSectionContent.replace("NODE_NAME_ID", nodeNameID);
        nodeSectionContent = nodeSectionContent.replace("NODE_LINK_DESC_ID", nodeLinkDescriptionID);
        nodeSectionContent = nodeSectionContent.replace("NODE_DESCRIPTION_ID", nodeDescriptionID);

        nodeSectionContent = nodeSectionContent.replaceAll("NODE_HREF", nodeURL);
        nodeSectionContent = nodeSectionContent.replace("NODE_LOGO_PATH", nodeIconURL);
        nodeSectionContent = nodeSectionContent.replace("NODE_NAME", nodeName);
        nodeSectionContent = nodeSectionContent.replace("NODE_DESCRIPTION", nodeDescription);


        nodeSection = nodeSection + nodeSectionContent;

    }

    finalHTML = nodeSection;



    return finalHTML

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


    let jsonTreeSize = Object.keys(jsonTree).length;

    if (jsonTreeSize < 5){

        rowShellHTML = buildRowSection(jsonTreeSize,0,4, false);
        nodeGroupHTML = buildNodeSection(jsonTree, 0, 4);

        nodeIntroRow = rowShellHTML.replace('NODE_GROUP', nodeGroupHTML);


    }
    else{


        //Build first row (static)
        rowShellHTML = buildRowSection(jsonTreeSize,0,4, false);
        nodeGroupHTML = buildNodeSection(jsonTree, 0, 4);

        nodeIntroRow = rowShellHTML.replace("NODE_GROUP", nodeGroupHTML);

        accordionRowHTML = buildRowSection(jsonTreeSize, 0, 4,true );


        //Build all other rows for the accordion section
        //Inner rows of accordion section are non-accordion
        for(let n = 4; n < (jsonTreeSize - (jsonTreeSize % 4)); n += 4 ){


            accordionInnerShellRowHTML = buildRowSection(jsonTreeSize, n, (n + 4), false);
            innerNodeGroupHTML = buildNodeSection(jsonTree, n, (n + 4));

            nodeAccordionInnerRowHTML = accordionInnerShellRowHTML.replace("NODE_GROUP", innerNodeGroupHTML);
            nodeInnerContent = nodeInnerContent + nodeAccordionInnerRowHTML;




        }

        if(jsonTreeSize % 4 > 0){

            remainderInnerShellRow = buildRowSection(jsonTreeSize, (jsonTreeSize - (jsonTreeSize % 4)), jsonTreeSize, false );
            remainderNodeGroup = buildNodeSection(jsonTree, (jsonTreeSize - (jsonTreeSize % 4)), jsonTreeSize);
            remainderInnerRowHTML = remainderInnerShellRow .replace("NODE_GROUP", remainderNodeGroup);
            nodeInnerContent = nodeInnerContent + remainderInnerRowHTML;
        }

        nodeAccordionRow = accordionRowHTML.replace("ACCORDION_BODY_CONTENT", nodeInnerContent);



    }

    nodeContent = nodeIntroRow + nodeAccordionRow;

    return nodeContent;


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



function readTemplate(filepath, filename){
    let folderpath = "../" + filepath + "/"  + filename;

    $.get(folderpath, function (result){
        //console.log(result)
        return result;
    });
}



function buildHomePage(){
    let jsonTree
    let homepage = "";
    let homepageTemplate = "";
    let nodeContent = "";
    var html = require("html");




    jsonTree = getNodeRegistry();

    //Uncomment when getting json from github
    /*
    jsonTree.then(function(result) {
   //console.log(result) // "Some User token"
    });
    */




    homepageTemplate = getHTMLTemplate("../templates", "index-template.html");
    nodeContent = buildNodeContent(jsonTree);

    homepageTemplate = homepageTemplate.replace("NODE_CONTENT", nodeContent);
    homepage = html.prettyPrint(homepageTemplate, {indent_size:2});

    return homepage;
    //saveHTML("..", "index.html", homepage);
}







function main(){



    //Uncomment when going live
    let dynamicNodeContent = getNodeRegistry();


    //console.log(dynamicNodeContent);
    //let dynamicNodeContent = buildHomePage();

    //return dynamicNodeContent;

}

main();

