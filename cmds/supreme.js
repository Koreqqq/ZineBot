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
    name: "supreme",
    description: "Własne logo Supreme",
    aliases: ["spr"],
    category: ":camera_with_flash: Zdjęcia",
    usage: "<tekst>",

    async run(message, args, client) {
        const tekst = args.join("+")
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
        if (!tekst) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}supreme <tekst>` + "`" + `\n**Tip:** Dodaj do argumentów \`--l\`, aby logo supreme stało się jasne.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (message.content.includes("--l")) {
            const tekst_n = tekst.replace("--l", "")
            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Twoje jasne logo Supreme", "https://cdn.iconscout.com/icon/free/png-512/aparat-569197.png")
            .setImage(`https://api.alexflipnote.dev/supreme?text=${tekst_n}&light=true`)
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);
        } else {
            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Twoje logo Supreme", "https://cdn.iconscout.com/icon/free/png-512/aparat-569197.png")
            .setImage(`https://api.alexflipnote.dev/supreme?text=${tekst}&light=false`)
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);
        }
	}
}