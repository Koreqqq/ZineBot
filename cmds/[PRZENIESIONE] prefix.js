const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const ut = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { wersjaBota } = require("../conf/vars.js")
const { settings } = require("cluster")

module.exports = {
    name: "prefix",
    description: "Zmienia prefix dla serwera (Komenda przeniesiona)",
    aliases: ["cp", "zmienprefix", "changeprefix", "pref"],
    usage: "<nowy prefix>",

    async run(message, args, client) {
        const settings = await conf.findOne({
            guildID: message.guild.id
          }, (err, srv) => {
            if (!srv) {
                const newConf = new conf({
                    _id: mongo.Types.ObjectId(),
                    guildID: message.guild.id,
                    prefix: "-",
                    kanalPropozycji: undefined,
                    kanalOgloszen: undefined,
                    wzmiankaOgloszen: undefined
                })
      
                newConf.save()
                .catch(err => console.error(err))
            }
        });
        err = new Discord.MessageEmbed()
        .setDescription(`Komenda została przeniesiona. Aby zmienić prefix użyj:` + "`" + `${settings.prefix}skonfiguruj set prefix <nowy prefix>` + "`")
        .setColor(0xFF3F3F)
        message.channel.send(err)
    }
}