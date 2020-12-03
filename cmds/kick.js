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
    name: "kick",
    description: "Wyrzuca użytkownika z serwera",
    aliases: ["k"],
    usage: "<@użytkownik> [powód]",

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
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const reasonArg = [...args].slice(1).join(" ") || "Nie podano"
        if (!user) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów, lub ten użytkownik nie jest na serwerze.\nPrawidłowe użycie komendy:` + "`" + `${prefix}kick <@wzmianka> [powód]` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (user.id == message.guild.owner) {
            emb = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Chcesz wyrzucić właściciela? Nonsens.`)
            .setColor(0xFF3F3F)
            return message.channel.send(emb)
        } else if (user.id == "745181618242846762") {
            emb = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie dla psa! Nie możesz mnie wyrzucić!`)
            .setColor(0xFF3F3F)
            return message.channel.send(emb)
        } else if (message.author.id == user.id) {
            emb = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie możesz wyrzucić samego siebie!`)
            .setColor(0xFF3F3F)
            return message.channel.send(emb)
        } else {
            try {
                user.kick(reasonArg)
            } catch {
                emb = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie mogę wyrzucić tego użytkownika. Sprawdź czy rola Zine jest nad najwyższą rangą użytkownika, którego chcesz wyrzucić.`)
                .setColor(0xFF3F3F)
                message.channel.send(emb)
            }
            // Na kanal
            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Wyrzucono użytkownika", "https://icon-library.com/images/moderator-icon/moderator-icon-14.jpg")
            .addFields(
                {
                    name: "Wyrzucony",
                    value: `${user} (\`${user.id}\`)`
                },
                {
                    name: "Powód",
                    value: reasonArg
                },
                {
                    name: "Moderator",
                    value: `${message.author} (\`${message.author.id}\`)`
                }
            )
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);

            // Do usera
            try {
                const e_us = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Zostałeś wyrzucony", "https://icon-library.com/images/moderator-icon/moderator-icon-14.jpg")
                .addFields(
                    {
                        name: "Powód",
                        value: reasonArg
                    },
                    {
                        name: "Moderator",
                        value: `${message.author} (\`${message.author.id}\`)`
                    }
                )
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                client.users.cache.get(user.id).send(e_us)
            } catch {
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Informacja", "https://2.bp.blogspot.com/-Sq6sW8O1mTk/UAsYMAwiA_I/AAAAAAAAPMo/zgdPHe-3bko/s1600/ban.png")
                .setDescription(`Niestety, nie mogę wysłać prywatnej wiadomości do tego użytkownika.`)
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
            }
        }
	}
}