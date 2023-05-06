
const fs = require('fs');
const {stdin, stdout} =process;
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname,'text.txt'),'utf-8');

stdout.write('Hi! You can input whatever you want.\n');
stdin.on('data',(data)=>{
  if(data.toString().trim() ==='exit'){
    process.exit();
  }
  process.on('SIGINT',()=>{
    process.exit();
  });
  output.write(data);
});
process.on('exit',()=>stdout.write('See you soon!\n'));

