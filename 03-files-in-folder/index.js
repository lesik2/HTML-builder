
const path = require('path');
const  {readdir} = require('node:fs/promises');
const fs =require('fs');


async function getInfoFiles(){
  try{
    const files = await readdir(path.join(__dirname,'secret-folder'),{withFileTypes: true});
    files.forEach((file)=>{
      if(file.isFile())
      {
        fs.stat(path.join(__dirname,'secret-folder',file.name),(error,stats)=>{
          if(error){
            console.log(error);
          }
          else{
            console.log(file.name.substring(0,file.name.lastIndexOf('.')) + ' - '+path.extname(file.name).slice(1) + ' - ' + stats.size);
          }
        });
      }

    });
  
  } catch(err){
    console.error(err);
  }

}
getInfoFiles();