const Discord = require("discord.js")
const mongo = require("mongoose")
const gSch = mongo.Schema({
    guildID: {
        type: Number,
        required: true
    },
    prefix: {
        type: String,
        required: true,
        default: "-"
    },
    kanalPropozycji: {
        type: String,
        required: false,
        default: undefined
    },
    kanalOgloszen: {
        type: String,
        required: false,
        default: undefined
    },
    wzmiankaOgloszen: {
        type: String,
        required: false,
        default: undefined
    }
}, { collection: "daneSerwerów" })
module.exports = mongo.model("serv", gSch)