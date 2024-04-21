const express = require('express');
const cors = require('cors')
const app = express();
const router = require('./routes/router.js')
const port = 8009;
const {connectMongoDb} = require('./db/connection.js')
const cookiParsar = require("cookie-parser")

connectMongoDb().then(()=> console.log("MongoisDB Connected"))
.catch(err => console.log("Mongo Err" , err))
// app.get('/', (req , res)=>{
//     res.status(201).json("server Created")
// })

app.use(express.json())
app.use(cors())
app.use(cookiParsar())

app.use(router)

app.listen(port, ()=>{
    console.log(`Server Started at ${port}`)
})