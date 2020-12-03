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
const { cos } = require("mathjs")

module.exports = {
    name: "ankieta",
    description: "Tworzy ankietę.",
    aliases: ["poll", "sondaż", "ankietę"],
    category: ":newspaper: Przydatne",
    usage: "<Pytanie %% Odpowiedź 1 %% Odpowiedź 2 %% ...>",

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
        args = tresc.split(/%%/g);
        const pytanie = args[0];
        const opcje = [...new Set(args.slice(1))];
        if (!message.member.hasPermission("MANAGE_GUILD")) {
            ep = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Potrzebujesz uprawnienia \`Zarządzanie serwerem\`, aby użyć tej komendy.`)
            .setColor(0xFF3F3F)
            message.channel.send(ep)
        } else if (!tresc) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}ankieta <Pytanie %% Odpowiedź 1 %% Odpowiedź 2 ...>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (opcje.length < 2) {
            err = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie możesz podać mniej niż 2 odpowiedzi.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (opcje.length > 9) {
            err = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie możesz podać więcej niż 9 odpowiedzi.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else try {
            let emotki = [
                "1️⃣",
                "2️⃣",
                "3️⃣",
                "4️⃣",
                "5️⃣",
                "6️⃣",
                "7️⃣",
                "8️⃣",
                "9️⃣",
                "🔟"
            ]

            // Tymczasowe zmienne
            let str = ""
            let eNum = 0

            // Str
            for (const txt of opcje) {
                str = str + `${emotki[eNum]} - ${opcje[eNum]}` + "\n"
                eNum++
            }

            // Na kanał
            args = args.map(a => a.replace(/"/g, ''));
            const pollEmb = new MessageEmbed()
            .setColor("#F0FF6E")
            .setAuthor("Nowa ankieta", "https://cdn.iconscout.com/icon/free/png-512/voting-poll-4-542529.png")
            .setDescription(`:bar_chart: ${pytanie} \n\n ${str}`)
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(pollEmb)
            .then(async (pollMsg) => {
                for (let eNum = 0; eNum < opcje.length; eNum++) {
                await pollMsg.react(emotki[eNum]);
                }
            })
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