function getNodeRegistry(){
    var fs = require('fs');
    const jsonURL = "https://raw.githubusercontent.com/DACCS-Climate/DACCS-node-registry/main/node_registry.json";
    const jsonFile = "node_registry.json";
    var jsonData;

//uncomment for getting json from github
/*
    fetch(jsonFile)
  .then(res =>   res.json()) // the .json() method parses the JSON response into a JS object literal
  .then(data => {return data } );
  */

//data => console.log(data)


    fs.readFile(jsonFile, 'utf8', function (err, data) {
  if (err) throw err;
  jsonData = JSON.parse(data);
  return jsonData;
});





}


function readFile(filepath, filename){

}



function readTemplate(filepath, filename){
    let folderpath = "../" + filepath + "/"  + filename;

    $.get(folderpath, function (result){
        //console.log(result)
        return result;
    });
}




function buildNodeContent(){

    let jsonTree = getNodeRegistry();
    console.log('jsonTree = ');
    console.log(jsonTree);
}



function buildNodeSection(jsonData, start, end){

    //json_tree = JSON.parse(jsonData);
    $.each(jsonData.items, function(key, value){
            console.log("key:" + key );
    });


    $.each(jsonData, function(key, value){

            console.log("jsonData key=" + jsonData.key);
            //return jsonData.key;

        });


}


buildNodeContent();