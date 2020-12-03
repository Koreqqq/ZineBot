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
    name: "aktualizacja",
    description: "Zamieszcza aktualizację",
    aliases: ["update", "upd"],
    category: "<:dscstaff:757997223891042395> Developerskie",
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
        const tresc = args.join(" ")
        if (message.author.id !== OwnerID) {
            ep = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Tą komendę może użyć tylko właściciel bota!`)
            .setColor(0xFF3F3F)
            message.channel.send(ep)
        } else if (!tresc) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}aktualizacja <treść>` + "`")
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else {
                if (tresc.includes("--early")) {
                    const tresc_nowa = tresc.replace("--early", "")
                    const e = new MessageEmbed()
                    .setColor("#F0FF6E")
                    .setAuthor("Nowa wersja beta", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flat_restart_icon.svg/512px-Flat_restart_icon.svg.png")
                    .setDescription(tresc_nowa)
                    .setFooter(`Aktualizację zamieścił ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    client.channels.cache.get("766920421811290132").send(e)

                    // Na kanał

                    const ec = new MessageEmbed()
                    .setColor("#F0FF6E")
                    .setAuthor("Sukces", "https://lh3.googleusercontent.com/6mPfUugVJcDvcc0OlXdrXRPpUY2ZI31AlgXX5_MB-sIcRWGTbpN3Xh89kLiJDg2pdg")
                    .setDescription(`Pomyślnie wysłano nową wersję beta na serwer bota.`)
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(ec)
                } else if (tresc.includes("--mark")) {
                    const tresc_nowa = tresc.replace("--mark", "")
                    // Na zmiany
                    
                    const e = new MessageEmbed()
                    .setColor("#F0FF6E")
                    .setAuthor("Nowa aktualizacja", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flat_restart_icon.svg/512px-Flat_restart_icon.svg.png")
                    .setDescription("```diff\n" + tresc_nowa + "```")
                    .setFooter(`Aktualizację zamieścił ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)

                    // Na kanał

                    const ec = new MessageEmbed()
                    .setColor("#F0FF6E")
                    .setAuthor("Sukces", "https://lh3.googleusercontent.com/6mPfUugVJcDvcc0OlXdrXRPpUY2ZI31AlgXX5_MB-sIcRWGTbpN3Xh89kLiJDg2pdg")
                    .setDescription(`Pomyślnie wysłano aktualizację z Markdownem na serwer bota.`)
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    
                    client.channels.cache.get("766922498796683294").send(e)
                    message.channel.send(ec)
                } else {
                    // Na zmiany
                    
                    const e = new MessageEmbed()
                    .setColor("#F0FF6E")
                    .setAuthor("Nowa aktualizacja", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flat_restart_icon.svg/512px-Flat_restart_icon.svg.png")
                    .setDescription(tresc)
                    .setFooter(`Aktualizację zamieścił ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)

                    // Na kanał

                    const ec = new MessageEmbed()
                    .setColor("#F0FF6E")
                    .setAuthor("Sukces", "https://lh3.googleusercontent.com/6mPfUugVJcDvcc0OlXdrXRPpUY2ZI31AlgXX5_MB-sIcRWGTbpN3Xh89kLiJDg2pdg")
                    .setDescription(`Pomyślnie wysłano aktualizację na serwer bota.`)
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    
                    client.channels.cache.get("766922498796683294").send(e)
                    message.channel.send(ec)
            }
        }
    }
}