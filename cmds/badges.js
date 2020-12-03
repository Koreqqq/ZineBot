const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const ModID = ["744935304271626258", ""]
const os = require("os")
const moment = require("moment")
const ut = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const badgesConf = require("../model/badges.js")
const { wersjaBota } = require("../conf/vars.js")
const { e } = require("mathjs")

module.exports = {
    name: "badges",
    description: "Wyświetla listę odznak",
    aliases: ["badge", "odznaki", "odzn", "odz"],
    category: "<:dscstaff:757997223891042395> Developerskie",
    usage: "<show / add / remove / fetch> [użytkownik]",

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
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(1).join(" ") || x.user.username === args[1]) || client.users.cache.get(args[1]) || message.author
        const badge = args[2]
        if (!akcja) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}badges <show / add / remove / fetch> [użytkownik]` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (!user) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie znaleziono takiego użytkownika.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (akcja === "add") {
            const badgesStt = await badgesConf.findOne({
                userid: user.id
            });
            if (message.author.id !== OwnerID) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Odznaki może nadawać tylko właściciel bota.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (!badgesStt) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie znaleziono takiego użytkownika w bazie danych. Aby go dodać użyj: \`${prefix}badges fetch <id użytkownika / @wzmianka>\`.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (!user || !badge) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}badges add <użytkownik> <odznaka>` + "`")
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (badge === "developer") {
                await badgesStt.updateOne({
                    developer: true
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("developer", "**Developer**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "staff") {
                await badgesStt.updateOne({
                    staff: true
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("staff", "**Support**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "bughunter") {
                await badgesStt.updateOne({
                    bughunter: true
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("bughunter", "**Łapacz błędów**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "zasluzony") {
                await badgesStt.updateOne({
                    zasluzony: true
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("zasluzony", "**Zasłużony**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "partner") {
                await badgesStt.updateOne({
                    partner: true
                })
                err = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("partner", "**Partner**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (badge === "wspierajacy") {
                await badgesStt.updateOne({
                    wspierajacy: true
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("supporter", "**Wspierający**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "earlyacc") {
                await badgesStt.updateOne({
                    earlyacc: true
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("earlyacc", "**Wczesny dostęp**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie znaleziono takiej odznaki. Lista dostępnych odznak:\n\`developer\`, \`staff\`, \`bughunter\`, \`zasluzony\`, \`partner\`, \`wspierajacy\`, \`earlyacc\`.`)
                .setColor(0xFF3F3F)
                return message.channel.send(err)
            }
        } else if (akcja === "remove") {
            const badgesStt = await badgesConf.findOne({
                userid: user.id
            });
            if (message.author.id !== OwnerID) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Odznaki może nadawać tylko właściciel bota.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (!badgesStt) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie znaleziono takiego użytkownika w bazie danych. Aby go dodać użyj: \`${prefix}badges fetch <id użytkownika / @wzmianka>\`.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (!user || !badge) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}badges remove <użytkownik> <odznaka>` + "`")
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (badge === "developer") {
                await badgesStt.updateOne({
                    developer: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie usunięto odznakę ${badge.replace("developer", "**Developer**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "staff") {
                await badgesStt.updateOne({
                    staff: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano odznakę ${badge.replace("staff", "**Support**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "bughunter") {
                await badgesStt.updateOne({
                    bughunter: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie usunięto odznakę ${badge.replace("bughunter", "**Łapacz błędów**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "zasluzony") {
                await badgesStt.updateOne({
                    zasluzony: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie usunięto odznakę ${badge.replace("zasluzony", "**Zasłużony**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "partner") {
                await badgesStt.updateOne({
                    partner: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie usunięto odznakę ${badge.replace("partner", "**Partner**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "wspierajacy") {
                await badgesStt.updateOne({
                    wspierajacy: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie usunięto odznakę ${badge.replace("wspierajacy", "**Wspierający**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else if (badge === "earlyacc") {
                await badgesStt.updateOne({
                    earlyacc: {}
                })
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie usunięto odznakę ${badge.replace("earlyacc", "**Wczesny dostęp**")} użytkownikowi ${user}.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            } else {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie znaleziono takiej odznaki. Lista dostępnych odznak:\n\`developer\`, \`staff\`, \`bughunter\`, \`zasluzony\`, \`partner\`, \`wspierajacy\`, \`earlyacc\`.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            }
        } else if (akcja === "fetch") {
            const badgesStt = await badgesConf.findOne({
                userid: user.id
            });
            if (badgesStt) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Ten użytkownik jest już w bazie danych.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else {
                const nC = new badgesConf({
                    userid: user,
                    developer: false,
                    staff: false,
                    bughunter: false,
                    zasluzony: false,
                    partner: false,
                    wspierajacy: false,
                    earlyacc: false,
                })
                nC.save()
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Pomyślnie dodano użytkownika ${user} do bazy danych.`)
                .setColor(0xFF3F3F)
                message.channel.send(e)
            }
        } else if (akcja === "show") {
            const badgesStt = await badgesConf.findOne({
                userid: user.id
            });
            if (!badgesStt) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie znaleziono takiego użytkownika w bazie danych. Aby go dodać użyj: \`${prefix}badges fetch <id użytkownika / @wzmianka>\`.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else {
                const e = new Discord.MessageEmbed()
                .setAuthor("Odznaki", "https://www.freeiconspng.com/thumbs/badge-icon-png/badge-icon-png-22.png")
                .setDescription(`Lista odznak użytkownika ${user} (\`${user.id}\`)`)
                .addField("<:dev:766927241631236116> Developer bota", `${badgesStt.developer}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .addField("<:zweryfikowany:766927244563447848> Staff", `${badgesStt.staff}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .addField("<:bughunter_lvl2:766927327711723522> Łapacz błędów", `${badgesStt.bughunter}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .addField("<:hypesquadevents:766927327467929601> Zasłużony", `${badgesStt.zasluzony}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .addField("<:partner:766927327731908639> Partner", `${badgesStt.partner}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .addField("<:earlysupporter:766927327845548043> Wspierający", `${badgesStt.wspierajacy}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .addField(":test_tube: Wczesny dostęp", `${badgesStt.earlyacc}`.replace(true, "**Tak**").replace("{}" || false, "**Nie**"))
                .setColor(0xFF3F3F)
                message.channel.send(e)
            }
        }
    }
}