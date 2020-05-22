const fs = require('fs')
const AdmZip = require('adm-zip')
const path = require('path')
const express = require('express')


const app = express();

//set static folder

app.use(express.static(path.join(__dirname, 'public')));

app.listen(4000, () => console.log("Server started on port 4000"));




 //create a zip instance

 let zip = new AdmZip();

//constructor function to make an object of the sender of each message + the content they have send

 function ModuleData(sender, content){
    this.sender = sender;
    this.content = content
}

//an array which will store ModuleData objects containing the modulename and the stored userdata 
let allUserData = [];

//get user data 
app.get('/get-user-data', async (req, res) => {

    //send message to every module to obtain all data

    //listen to wordpress.gdpr queue 

    //extract the sender and the content from the xml message
    //...

    //make a moduleData object and add it to the allUserData array

    // Hard coded voorbeeld om werking te demonstreren, doe dit in een loop met data die van de queue komt
    let moduleData = new ModuleData(/*sender die van de queue komt*/"Facturatie", /*content die van de queue kom*/"Naam: zico van ongeval");
    let moduleData2 = new ModuleData(/*sender die van de queue komt*/"Wordpress", /*content die van de queue kom*/"Naam: zico van ongeval");
    let moduleData3 = new ModuleData(/*sender die van de queue komt*/"Odoo", /*content die van de queue kom*/"Naam: zico van ongeval");
    let moduleData4 = new ModuleData(/*sender die van de queue komt*/"Salesforce", /*content die van de queue kom*/"Naam: zico van ongeval");

    allUserData.push(moduleData);
    allUserData.push(moduleData2);
    allUserData.push(moduleData3);
    allUserData.push(moduleData4);

    
    //wait for the files to be zipped
    let resultFile = await createZip(allUserData);
 

    //Send a download of the file back to the user
    res.download(`./${resultFile}`, (err) => {
        if(err){
            console.log("Download error" + err)
        }
        else{
            console.log("oke")
        }
    })

    
});



function createZip(allUserData){

    let zipName = "user-data";

    //loop over the array with all the user data and create a file for each module and add them to the zip
    for(let moduleData of allUserData){
        zip.addFile(`${moduleData.sender}.txt`, Buffer.alloc(moduleData.content.length, moduleData.content));
    }

    //zip the files
    zip.writeZip(zipName, "./");

    return zipName;
}



