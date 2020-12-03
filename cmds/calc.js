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
const math = require("mathjs")
const { prefix } = require("../conf/vars.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "calc",
    description: "Obliczanie wyrażeń matematycznych.",
    aliases: ["kalkulator", "oblicz", "licz", "liczenie"],
    category: ":newspaper: Przydatne",
    usage: "<działanie>",

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
        const dzialanie = args.join(" ")
        const prefix = settings.prefix
        if (!dzialanie) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}calc <działanie>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else {
            try {
                let wynik = math.evaluate(dzialanie)
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Działanie matematyczne", "https://cdn.iconscout.com/icon/free/png-512/calculator-717-461704.png")
                .addField("Działanie", dzialanie)
                .addField("Wynik", wynik)
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
            } catch (err) {
                emb = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`No co, liczyć nie umiesz? Podaj dobre działanie. Albo wróć do podstawówki.`)
                .setColor(0xFF3F3F)
                message.channel.send(emb)
            }
        }
	}
}