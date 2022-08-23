require('dotenv').config()
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const morgan = require('morgan')
const user = require("./routes/user");
const card=require("./routes/card");
require("./databases/mongoDb");
var cors = require('cors');
const chalk=require('chalk');
app.use(cors());

const checkConnection = require("./middleware/checkConnection")
app.use(morgan('tiny'));

app.use(checkConnection);
app.use('/user',user);
app.use('/card',card);

app.listen(PORT, () => {
console.log(chalk.yellow("Server is up on port "+PORT+ " 🎀"));
    });