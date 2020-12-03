const { MessageEmbed } = require("discord.js")
const conf = require("../model/guildConfig.js")
module.exports = async () => {
    const settings = await conf.findOne({ guildID: message.guild.id })
    const prefix = settings.prefix
    msgWarn: function start(chn) {
        return chn.send("test")
    }
    start(message.channel)
}
