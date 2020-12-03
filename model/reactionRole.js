const Discord = require("discord.js")
const mongo = require("mongoose")
const rSch = mongo.Schema({
    messageId: {
        type: String,
        required: true 
    },
    emojiRoleMappings: {
        type: mongoose.Schema.Types.Mixed 
    }
}, { collection: "reactionRole" })
module.exports = mongo.model("rr", rSch)