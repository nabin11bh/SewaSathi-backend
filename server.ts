        import { config } from "dotenv"
        config()
        import app from "./src/app"

        import "./src/database/connection"
        import { envConfig } from "./src/config/config"

        function startServer(){
        const port = envConfig.appPort
            app.listen(port,function(){
                console.log(`server has started at  ${port}`)
            })
        }

        startServer()


