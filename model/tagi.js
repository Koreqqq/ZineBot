const mongo = require("mongoose")
const tag = new mongo.Schema({
    serwer: {
        type: String,
        required: true
    },
    komenda: {
        type: String,
        required: true
    },
    tresc: {
        type: String,
        required: true
    }
}, { collection: "tagi" })
module.exports = mongo.model("tagi", tag)