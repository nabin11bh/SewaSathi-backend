import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config"
import { User } from "./models/user.model";

const sequelize = new Sequelize({
  database: envConfig.database,
  username : envConfig.username,
  password : envConfig.password,
  host : envConfig.host,
  dialect : envConfig.dialect,
  port : envConfig.port,
  models : [User]
 
})

sequelize.authenticate()
.then(()=>{
    console.log("Authenticated,connected")
})
.catch((error)=>{
    console.log(error)
})

sequelize.sync({force:false})
.then(()=>{
  console.log("migrated successfully")
})

export default sequelize