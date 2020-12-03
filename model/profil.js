const mongo = require("mongoose")
const pSch = new mongo.Schema({
    userID: {
        type: String,
        required: true,
        default: "Nie podano"
    },
    imie: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    wiek: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    statusMilosny: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    youtube: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    github: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    instagram: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    facebook: {
        type: String,
        required: false,
        default: "Nie podano"
    },
    whatsapp: {
        type: String,
        required: false,
        default: "Nie podano"
    }
}, { collection: "profile" })
module.exports = mongo.model("prof", pSch)