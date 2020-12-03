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
    name: "trump",
    description: "Tweet jako Trump",
    category: ":camera_with_flash: Zdjęcia",
    aliases: ["tweet"],
    usage: "<treść tweeta>",

    async run(message, args, client) {
        const kom = args.join("+")
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
        if (!kom) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}trump <treść tweeta>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else {
            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Tweet jako Donald Trump", "https://lh3.googleusercontent.com/proxy/oHbveuZTryMzR-QGAiBM52GKsnu5JSl0uVZCqZKPzqGUhLcAyBj5mC94zjcQxqYTuWoU3UuipqKjJW2wExi9kaufmVzCS8nuPyWhlGqsFOD3_beKT2s")
            .setImage(`https://api.no-api-key.com/api/v2/trump?message=${kom}`)
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);
        }
	}
}