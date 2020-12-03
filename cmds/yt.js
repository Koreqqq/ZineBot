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
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "yt",
    description: "Tworzy fake komentarz YouTube.",
    category: ":camera_with_flash: Zdjęcia",
    aliases: ["youtube", "yt-comment", "youtube-comment"],
    usage: "<treść>",

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
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}yt <treść>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (tekst.length > 20) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Treść komentarza nie może mieć więcej niż 20 liter.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else {
            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Komentarz YouTube", "https://cdn.iconscout.com/icon/free/png-512/aparat-569197.png")
            .setImage(`https://some-random-api.ml/canvas/youtube-comment?avatar=${message.author.displayAvatarURL({ dynamic: false })}&username=${message.author.username}&comment=${tekst}`)
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);
        }
	}
}