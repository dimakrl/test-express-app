import * as express from "express"
import {Request, Response} from "express"
import {CONFIG} from "./shared/app.config";
import dataSource from "./ormconfig";
import imageController from "./handlers/image/image.controller";
import * as bodyParser from 'body-parser'

dataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded());

app.use('/images', imageController)

app.get("/health", function (req: Request, res: Response) {
    res.json({
        healthy: true,
        v: '1.1.0',
    })
})

const PORT = CONFIG.PORT;

app.listen(PORT, () => {
    console.log(`Server on ${PORT}`)
})