
const fs = require('fs');
const path = require('path');
const {mkdir,readdir,copyFile} = require('node:fs/promises');




let data ='';
let arrTags='';

const stream = fs.createReadStream(path.join(__dirname,'template.html'),'utf-8');
stream.on('data',chunk=> data+=chunk);
stream.on('end',()=>{
  arrTags = data.toString().match(/{{\w+}}/g);
  readFiles();
});

async function readFiles(){
  try{
    const files = await readdir(path.join(__dirname,'components'),{withFileTypes: true});
    const projectFolder=path.join(__dirname,'project-dist');
    const dirCreation = await mkdir(projectFolder, {recursive: true});
    if(dirCreation === undefined)
    {
      console.log('Direction has already downloaded');
     
    } 
    else{
      console.log(dirCreation);
    }
    createCss();
    copyDir(path.join(__dirname,'project-dist','assets'),path.join(__dirname,'assets'));
    
    files.forEach( async (file)=>{
      if(file.isFile && path.extname(file.name)==='.html'){
        if(arrTags.includes(`{{${file.name.substring(0,file.name.lastIndexOf('.'))}}}`)){
          let page={
            name: `{{${file.name.substring(0,file.name.lastIndexOf('.'))}}}`,
            info: ''
          };
          let promise = await result(file);
          page.info=promise;
          data = data.toString().replace(page.name,page.info);
          let output = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'));
          output.write(data);

        }
      }
    });
  }catch(err){
    console.log(err);
  }
  
 
}
async function copyDir(projectFolder,folder){
  try{
    await mkdir(projectFolder, {recursive: true});
    const files = await readdir(folder,{withFileTypes: true});

    files.forEach(async (file)=>{
      if(file.isDirectory()){
        copyDir(path.join(projectFolder,file.name),path.join(folder,file.name));
      }
      else{
        await copyFile(path.join(folder,file.name),path.join(projectFolder,file.name));
      }
      
  
    });

  }catch(err){
    console.log(err);
  }
 

}
async function createCss(){
  const files = await readdir(path.join(__dirname,'styles'),{withFileTypes: true});
  const output = fs.createWriteStream(path.join(__dirname,'project-dist','style.css'));
  let stream;
  let data = '';
  files.forEach((file)=>{
    if(file.isFile() && path.extname(file.name)==='.css')
    {
      stream = fs.createReadStream(path.join(__dirname,'styles',file.name),'utf-8');
      stream.on('data', chunk =>data+=chunk);
    }
  });
  stream.on('end',()=>{
    output.write(data);
  });
  
}
function result(file){
  let promise=new Promise(function(resolve){
    const stream = fs.createReadStream(path.join(__dirname,'components',file.name),'utf-8');
    let infoFromFile='';
    stream.on('data',(chunk)=>{
      infoFromFile+=chunk;
    });
    stream.on('end',()=>{
      resolve(infoFromFile);
    });
    stream.on('error', error => console.log('Error', error.message));

  });
  return promise;
}