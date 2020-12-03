const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const ut = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "eval",
    description: "Wykonuje podane polecenie",
    aliases: ["e"],
    category: "<:dscstaff:757997223891042395> Developerskie",
    usage: "<polecenie>",
    ownerOnly: true,

    async run(message, args, client, tools) {
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
        if (message.author.id !== OwnerID) {
            ep = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Tą komendę może użyć tylko właściciel bota!`)
            .setColor(0xFF3F3F)
            message.channel.send(ep)
        } else try {
            input = args.join(" ")
            if (!input) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}eval <polecenie>` + "`")
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else {
                let evaled = await eval(input)
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Wykonano polecenie", "https://icon-library.com/images/terminal-icon-png/terminal-icon-png-6.jpg")
                .addFields(
                    {
                        name: "Komenda",
                        value: "```js\n" + input + "```"
                    },
                    {
                        name: "Zwrot",
                        value: "```js\n" + evaled + "```"
                    },
                    {
                        name: "Typ zwrotu",
                        value: "```js\n" + typeof evaled + "```"
                    }
                )
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
            }
        } catch (err) {
            const e = new MessageEmbed()
            .setColor("#FF3F3F")
            .setAuthor("Błąd przy wykonywaniu polecenia", "https://icon-library.com/images/terminal-icon-png/terminal-icon-png-6.jpg")
            .setDescription(`Treść błędu:` + "```js\n" + err + "```")
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);
        }
    }
}