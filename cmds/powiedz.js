const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const utils = require("util")
const ms = require("ms")
const { prefix } = require("../conf/vars.js")
const { wersjaBota } = require("../conf/vars.js")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { NOTIMP } = require("dns")

module.exports = {
    name: "powiedz",
    description: "Wysyła wiadomość jako bot",
    aliases: ["pw", "say"],
    category: ":newspaper: Przydatne",
    usage: "<tekst>",

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
        const prefix = settings.prefix
        const tresc = args.join(" ")
        if (!tresc) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}powiedz <wiadomość>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else {
            message.channel.send(tresc)
        }
	}
}