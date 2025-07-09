import { config } from "dotenv"
import app from "./src/app"
config()
import "./src/database/connection"
import { envConfig } from "./src/config/config"

function startServer(){
   const port = envConfig.port
    app.listen(port,function(){
        console.log(`server has started at  ${port}`)
    })
}

startServer()


