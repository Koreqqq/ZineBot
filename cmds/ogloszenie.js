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
    name: "ogloszenie",
    description: "Wysyła ogłoszenie na kanał ogłoszeniowy.",
    aliases: ["ogl", "shout", "news", "ogłoszenie"],
    category: ":newspaper: Przydatne",
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
        const tresc = args.join(" ")
        const prefix = settings.prefix
        const kanalOgloszen = settings.kanalOgloszen
        const wzmianka = settings.wzmiankaOgloszen
        if (!kanalOgloszen) {
            err = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie ustawiono kanału, na który mają być wysyłane ogłoszenia w konfiguracji serwera. Aby to zrobić użyj: \`${prefix}skonfiguruj set announcementChannel <#kanał>\` (Może tego dokonać tylko osoba z uprawnieniem \`Zarządzanie serwerem\`)`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (!message.member.hasPermission("MANAGE_GUILD")) {
            ep = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Potrzebujesz uprawnienia \`Zarządzanie serwerem\`, aby użyć tej komendy.`)
            .setColor(0xFF3F3F)
            message.channel.send(ep)
        } else if (!tresc) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}ogloszenie <treść>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else try {
            const annChn = kanalOgloszen.replace("<#", "").replace(">", "")
            const ek = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Nowe ogłoszenie", "https://cdn2.iconfinder.com/data/icons/mixed-rounded-flat-icon/512/megaphone-512.png")
            .setDescription(tresc)
            .setFooter(`Ogłoszenie umieścił ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            if (wzmianka) message.guild.channels.cache.get(annChn).send(wzmianka)
            message.guild.channels.cache.get(annChn).send(ek)
        } catch (err) {
            console.error(error)
            e = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Ojjjjj... Wygląda na to, że podczas próby wywołania komendy wystąpił duży błąd. Został on już zgłoszony do developerów bota. Zostanie on naprawiony w najbliższym czasie.`)
            .setColor(0xFF3F3F)
            message.channel.send(e)

            emb = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nazwa serwera: ${message.guild.name}\nTreść błędu:` + "`js\n" + `${error}` + "`")
            .setColor(0xFF3F3F)
            client.channels.cache.get("768108106667786241").send(emb)
            client.channels.cache.get("768108106667786241").send("[ <@&766357537477099533> ]")
        }
	}
}