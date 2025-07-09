import { config } from "dotenv"
import app from "./src/app"
config()
import "./src/database/connection"

function startServer(){
   const port = process.env.portNumber
    app.listen(port,function(){
        console.log(`server has started at  ${port}`)
    })
}

startServer()


