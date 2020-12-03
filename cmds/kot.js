const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const utils = require("util")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const ms = require("ms")
const axios = require("axios")
const { prefix } = require("../conf/vars.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "kot",
    description: "Randomowe zdjęcie kota",
    aliases: ["cat"],
	category: ":camera_with_flash: Zdjęcia",

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
            let odpowiedz = await axios.get("https://api.alexflipnote.dev/cats")
            let img = odpowiedz.data
            return img
        }
        let imgv = await getimg()
        const e = new MessageEmbed()
		.setColor("#75FF67")
        .setAuthor("Losowe zdjęcie kota", "https://cdn.iconscout.com/icon/free/png-512/aparat-569197.png")
        .setImage(imgv.file)
		.setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        message.channel.send(e);
	}
}