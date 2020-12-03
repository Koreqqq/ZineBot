const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const utils = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const axios = require("axios")
const figlet = require("figlet")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "ascii",
    description: "Konwertuje tekst na ascii.",
    category: ":camera_with_flash: Zdjęcia",
    aliases: ["asc"],
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
        const tekst = args.join(" ")
        if (!tekst) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}ascii <tekst>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (tekst.length > 13) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Twój tekst nie może mieć więcej niż 13 liter, ponieważ ascii nie zadziała.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else {
            figlet.text(tekst, function(err, d) {
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Tekst Ascii", "https://image.winudf.com/v2/image/Y29tLnZtcy5hc2NpaV9pY29uXzE1MDY3MTQ4MzlfMDI4/icon.png?w=170&fakeurl=1")
                .setDescription("```" + d + "```")
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e)
            })
        }
	}
}