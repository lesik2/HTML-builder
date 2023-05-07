

const {mkdir,readdir,copyFile} = require('node:fs/promises');
const path = require('path');
const { unlink } = require('node:fs');

async function copyDir(){
  try{
    const projectFolder=path.join(__dirname,'files-copy');
    const dirCreation = await mkdir(projectFolder, {recursive: true});
    const files = await readdir(path.join(__dirname,'files'),{withFileTypes: true});
    if(dirCreation === undefined)
    {
      console.log('Directory has already downloaded');
      const filesCopy = await readdir(path.join(__dirname,'files-copy'),{withFileTypes: true});
      filesCopy.forEach((file)=>{
        if(!files.includes(file)){
          unlink(path.join(__dirname,'files-copy',file.name),(err)=>{
            if(err) throw err;
          });
        }
      });
    } 
    else{
      console.log(dirCreation);
    }
    files.forEach(async (file)=>{
      await copyFile(path.join(__dirname,'files',file.name),path.join(__dirname,'files-copy',file.name));
  
    });

  }catch(err){
    console.log(err);
  }
 

}
copyDir();