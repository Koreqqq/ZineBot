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
    name: "suggest",
    description: "Wstawia propozycję na kanał",
    aliases: ["sug", "propozycja", "zaproponuj"],
	category: ":newspaper: Przydatne",

    async run(message, args, client) {
        const tresc = args.join(" ")
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
        const kanalPropozycji = settings.kanalPropozycji
        if (!kanalPropozycji) {
            err = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie ustawiono kanału propozycji w konfiguracji serwera. Aby to zrobić użyj: \`${prefix}skonfiguruj set suggestionsChannel <#kanał>\` (Może tego dokonać tylko osoba z uprawnieniem \`Zarządzanie serwerem\`)`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (!tresc) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}suggest <treść propozycji>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else try {
            // Na kanal serwerowy
            const sugChn = kanalPropozycji.replace("<#", "").replace(">", "")
            const ek = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Nowa propozycja", "https://img2.pngio.com/download-free-png-poll-png-6-png-image-dlpngcom-poll-png-800_800.jpg")
            .setDescription(tresc)
            .setFooter(`Propozycję umieścił ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.guild.channels.cache.get(sugChn).send(ek).then(function (doReakcji) {
                doReakcji.react("👍🏻")
                doReakcji.react("👎🏻")
            })

            // Na kanał komendy

            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Sukces", "https://lh3.googleusercontent.com/6mPfUugVJcDvcc0OlXdrXRPpUY2ZI31AlgXX5_MB-sIcRWGTbpN3Xh89kLiJDg2pdg")
            .setDescription("Pomyślnie wysłano propozycję na serwerowy kanał propozycji.")
            .setFooter(`Bot nie wysłał propozycji? Prawdopodobnie nie ma uprawnień do wysyłania wiadomości na kanał propozycji. / Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e)
        } catch (e) {
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