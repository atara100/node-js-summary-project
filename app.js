require('dotenv').config()
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const user = require("./routes/user");
const card=require("./routes/card");
require("./databases/mongoDb");
var cors = require('cors');
app.use(cors());

const checkConnection = require("./middleware/checkConnection")

app.use(checkConnection);
app.use('/user',user);
app.use('/card',card);

app.listen(PORT, () => {
console.log("Server is up on port "+PORT+ " 🎀");
    });