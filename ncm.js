const env = require('dotenv').config()
const path = require('path');
const fs = require('fs');
class Ncm {
    port = process.env.PORT||3000;
    domain = process.env.DOMAIN||'localhost';
    rootPath = process.env.ROOT_PATH || process.cwd();
    applicationFolder = process.env.APPLICATION_FOLDER || path.join(process.cwd(),'application');
    viewsFolder = process.env.VIEWS_FOLDER ||path.join(process.cwd(),'application','views');
    publicFolder = process.env.PUBLIC_FOLDER ||path.join(process.cwd(),'application','public');
    Routers = [];
    constructor(options={}){
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
        let files = fs.readdirSync(path.join(this.applicationFolder,'routes'));
        let routerFiles = [];
        files.forEach(e=>{
            routerFiles.push({name:path.parse(e).name,path:path.join(this.applicationFolder,'routes',path.parse(e).name)})
        })
        this.Routers = routerFiles;
        
    }
    load = {
        npm:(str)=>{
            try{
                this[str] = require(str)
                return this
            }catch(e){
                console.log("\x1b[31m%s\x1b[0m",`Ncm load error: ${e.code}`);
            }
            return this;
        },
        model : (str)=>{
            try{
                this.model[str] = require(path.join(this.applicationFolder,'models',`${str}`))
                return this.model[str]
            }catch(e){
                console.log("\x1b[31m%s\x1b[0m",`Ncm load model error - ${str} model not found: ${e.code}`);                
            }
        },
        plugin : (str)=>{
            try{
                this.plugin[str] = require(path.join(this.applicationFolder,'plugins',`${str}`))
                return this.plugin[str]
            }catch(e){
                console.log("\x1b[31m%s\x1b[0m",`Ncm load plugin error - ${str} plugin not found: ${e.code}`);                
            }
        },
        config:async(file)=>{
            return new Promise((resolve,reject)=>{
                fs.readFile(path.join(this.applicationFolder,'configs',`${file}.json`),'utf-8',(err,data)=>{
                    if(err){
                        reject(`Ncm load configs files error: ${err}`)
                    }
                    resolve(JSON.parse(data))
                })
            })
        }
    }
    run = ()=>{
        try{
            const express = require('express');
            const app = express()
            app.use(express.json());
            app.use(express.urlencoded({extended:true}));
            app.set('x-powered-by',false)
            app.set('views',this.viewsFolder)
            app.use(express.static(this.publicFolder))
            try{
                app.use(require('cookie-parser')('Emok-Ncm',`emokncm-${Date.now()}-secret`));
            }catch(e){
                console.log("\x1b[31m%s\x1b[0m",`Ncm run error - cookie-parser not found: ${e.code}`);
            }
            try{
                app.use(require('morgan')('tiny'))
            }catch(e){
                console.log("\x1b[31m%s\x1b[0m",`Ncm run error - morgan not found: ${e.code}`);
            }
            try{                
                app.use('/',require(path.join(this.applicationFolder,'routes','home')));
            }catch(e){
                console.error("\x1b[31m%s\x1b[0m",`Ncm run error - home route not found: ${e.code}`);                                
            }
            try{
                
                this.Routers.forEach(e=>{
                    app.use(`/${e.name}`,require(`${e.path}`))
                })
               
            }catch(e){
                console.error("\x1b[31m%s\x1b[0m",`Ncm run error - problem in router files structure: ${e.code}`);
            }
            app.use((req,res)=>{
                res.sendFile(path.join(this.publicFolder,'html','index.html'))
            })
            const server = require('http').createServer(app).listen(this.port,()=>{
                console.log("\x1b[32m%s\x1b[0m",`Your Ncm server is runnig on port: ${this.port}`);
            })
            this.server = server
            return this
        }catch(e){
            console.log("\x1b[31m%s\x1b[0m",`Ncm run error - express not found: ${e.code}`);
        } 
    }
    createRoute = ()=>{
        try{
            this.route = require('express').Router()
            return this
        }catch(e){
            console.log("\x1b[31m%s\x1b[0m",`Ncm not found express in node_modules folder: ${e.code}`);
        }
    }
    model = {}
    plugin = {}
}

module.exports = Ncm