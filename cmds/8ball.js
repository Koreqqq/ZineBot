const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const utils = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "8ball",
    description: "Losowa odpowiedź na podane przez ciebie pytanie",
	aliases: ["8b", "osiemball"],
    usage: "<pytanie>",
    
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
        const pytanie = args.join(" ")
        if (!pytanie) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}8ball <pytanie>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else {
            const odpowiedzi = [
                'Tak.',
                'Nie.',
                'Nie wiem.',
                'Na pewno.',
                'Oczywiście, że tak.',
                'Nie mam pewności, ale nie.',
                'Hmm...',
                'Co to za pytanie?',
                'Serio? To nie wiem.',
                'Jest duża szansa.',
                'Powtórz, nie rozumiem.',
                'Chyba tak.',
                'Chyba nie.',
                'Myślę, że tak.',
                'Myślę, że nie.'
            ]
            const e = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("8ball", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/1200px-8-Ball_Pool.svg.png")
            .addField("Pytanie", pytanie, false)
            .addField("Odpowiedź", odpowiedzi[Math.floor(Math.random()*odpowiedzi.length)], false)
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(e);
        }
    }
}