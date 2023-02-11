const app=require('./app');
const dotenv=require("dotenv")
const connectDatabase=require("./config/database");
const { Server } = require('http');

//Handling uncaught Error example 
//Ex console.log(Youtube)
process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`Shutting down te server due to unhandled Promise Rejection`)
    process.exit(1)
})
// console.log(youtube)

//Config
dotenv.config({path:"backend/config/config.env"})
//Connecting to database
connectDatabase()
let appServer =app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

//Unhandled Prmoise Rejection occcurs if DB_URI: MongoDB chnaged to Mongo or any thingelse

process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log('shutting down the servr due to unhandled Promise Rejection')
   appServer.close(() => {
     process.exit(1);
   });
})