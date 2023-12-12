const mongoose = require('mongoose');
const dotEnv = require('dotenv')
dotEnv.config({ path: './config.env' })
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message)
    //we don't need server here
    // server.close(() => {
    process.exit(1)
    // })
})

const app = require("./app");
//console.log(process.env)//variable in node js process





mongoose.connect(process.env.CONN_STR).then((conn) => {
    //console.log(conn);
    console.log('db connection successfull');
})


//CREATE A SERVER
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log('server has started ....')
})

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})

