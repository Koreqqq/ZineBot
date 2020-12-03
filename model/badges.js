const mongo = require("mongoose")
const badges = new mongo.Schema({
    userid: {
        type: Number,
        required: true
    },
    developer: {
        default: false,
    },
    staff: {
        default: false,
    },
    bughunter: {
        default: false,
    },
    zasluzony: {
        default: false,
    },
    partner: {
        default: false,
    },
    wspierajacy: {
        default: false,
    },
    earlyacc: {
        default: false
    }
}, { collection: "badges" })
module.exports = mongo.model("bdg", badges)