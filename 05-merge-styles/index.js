const fs =require('fs');
const path =require('path');
const {readdir} = require('node:fs/promises');



async function readFiles(){
  const files = await readdir(path.join(__dirname,'styles'),{withFileTypes: true});
  const output = fs.createWriteStream(path.join(__dirname,'project-dist','bundle.css'));
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
readFiles();


