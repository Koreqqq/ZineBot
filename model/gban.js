const mongo = require("mongoose")
const gbSch = new mongo.Schema({
    bannedUserID: {
        type: Number,
    },
    status: {
        type: String,
        required: true,
        default: "Brak bana",
    },
    powod: {
        type: String,
        required: true,
        default: "Ten użytkownik nie jest globalnie zbanowany!",
    },
    moderator: {
        type: String,
        required: true,
        default: "Brak"
    }
}, { collection: "gbany" })
module.exports = mongo.model("gban", gbSch)