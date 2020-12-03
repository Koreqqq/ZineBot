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
const rst = require("pm2")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "restart",
    description: "Randomowe zdjęcie ptaka",
    aliases: ["reload", "rl", "rst", "rs"],
    category: "<:dscstaff:757997223891042395> Developerskie",
    usage: "<% / komenda>",

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
        const akcja = args[0]
        if (message.author.id !== OwnerID) {
            ep = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Tą komendę może użyć tylko właściciel bota!`)
            .setColor(0xFF3F3F)
            message.channel.send(ep)
        } else if (!akcja) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}restart <%/komenda>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (akcja === "%") {
            rst.reload("node ..")
        } else try {
                let cmd = require(`./${akcja}`)
                delete require.cache[require.resolve(`./${akcja}.js`)]
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Przeładowano", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Crystal_128_reload.svg/768px-Crystal_128_reload.svg.png")
                .setDescription(`Pomyślnie przeładowano ${args[0].replace("%", "bota")}.`)
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
            } catch (err) {
                err = new Discord.MessageEmbed()
                .setAuthor("Błąd przy próbie przeładowania", "https://www.freeiconspng.com/uploads/failure-icon-2.png")
                .setDescription(`Nie znaleziono komendy ${akcja}.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
        }
    }
}