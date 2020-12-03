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
const { prefix } = require("../conf/vars.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "mem",
    description: "Losowy polski mem.",
    aliases: ["meme"],
	category: "<a:zabawa:747352529880219701> Zabawa",

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
        let getimg = async () => {
            let odpowiedz = await axios.get("http://memapi.glitch.me/")
            let img = odpowiedz.data
            return img
        }
        let imgv = await getimg()
        message.channel.startTyping(1)
        const e = new MessageEmbed()
		.setColor("#75FF67")
        .setAuthor(`Mem - ${imgv.title}`, "https://ddob.com/uploads/i_n_n_a/69866de0759af10117ae993dd43ea1f8.png")
        .setImage(imgv.zdj)
		.setFooter(`Źródło: ${imgv.link} / Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        message.channel.send(e)
        message.channel.stopTyping(1)
	}
}