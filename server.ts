import app from "./src/app"
import { envConfig } from "./src/config/config"


function startServer(){
   const port =envConfig.portNumber
    app.listen(port,function(){
        console.log(`server has started at  ${port}`)
    })
}

startServer()


