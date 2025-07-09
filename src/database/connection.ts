import { Sequelize } from "sequelize";
import { envConfig } from "../config/config"

const sequelize = new Sequelize({
  database: envConfig.database,
  username : envConfig.username,
  password : envConfig.password,
  host : envConfig.host,
  dialect : envConfig.dialect,
  port : envConfig.port
 
})

sequelize.authenticate()
.then(()=>{
    console.log("Authenticated,connected")
})
.catch((error)=>{
    console.log(error)
})

export default sequelize