const mongoose = require("mongoose")
require('dotenv').config()

function dbConnect() {
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log("Połączono z bazą")
    }).catch((err) => {
      console.log("Nie można połączyć się z MongoDB. Błąd: " + err)
    })
}

module.exports = dbConnect