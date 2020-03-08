const http = require('http');//adding http module
const fs = require('fs');//adding fs module
const path = require('path');//adding path module
const port = 3002; //set desire port no
const hostname = 'localhost'; //running on local host
//use postman only

const server = http.createServer((req,res)=>{
        if(req.method==='GET'){//checking req type / html verb
            if(req.url==='/') fileUrl ='/about.html';
            else fileUrl = req.url;

            var filePath = path.resolve('/nodejs/node js/node with http','./about.html');//getting the file path
            var fileExt = '.html';
            console.log(filePath);
            // path.extName(filePath);
            if(fileExt === '.html'){
                    fs.exists(filePath, (exists)=>{//checking file existence
                        if(!exists){
                            res.statusCode =404;
                            res.setHeader('Content-Type','text/html');
                            res.end('<html><body><h1>Error 404: file not found </h1></body></html>');
                        }
                        else{
                            res.statusCode =200;
                            res.setHeader('Content-Type','text/html');
                            fs.createReadStream(filePath).pipe(res);

                        }
                    })
            }else{
                res.statusCode =404;
                res.setHeader('Content-Type','text/html');
                res.end('<html><body><h1>Error 404: not htmltype </h1></body></html>');

            }




        }else{

            res.statusCode =404;
            res.setHeader('Content-Type','text/html');
            res.end('<html><body><h1>Error 404: not get method</h1></body></html>');
        }

});


server.listen(port,hostname,()=>{//starting server
    console.log(`server listening in port http://${hostname}:${port}`);
})