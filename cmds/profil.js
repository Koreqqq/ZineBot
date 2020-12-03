const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const utils = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const profileConf = require("../model/profil.js")
const axios = require("axios")
const math = require("mathjs")
const { prefix } = require("../conf/vars.js")
const { wersjaBota } = require("../conf/vars.js")
const { isInteger } = require("mathjs")

module.exports = {
    name: "profil",
    description: "Pokazuje Twój profil lub go edytuje.",
    aliases: ["profile", "userprofile", "prf"],
    category: ":newspaper: Przydatne",
    usage: "<create / show / edit> [imie / wiek / status / youtube / github / instagram / facebook / whatsapp] [nowa treść]",

    async run(message, args, client) {
        const tresc = args.join(" ")
        const akcja = args[0]
        const opcja = args[1]
        const ust = [...args].slice(2).join(" ")
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
        const profileSettings = await profileConf.findOne({
            userID: message.author.id
        })
        if (!akcja) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}profil <create / show / edit> [imie / wiek / status / youtube / github / instagram / facebook / whatsapp] [nowa treść]` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (akcja === "show") try {
            if (!profileSettings) {
                err = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie posiadasz profilu. Możesz go stworzyć za pomocą komendy \`${prefix}profil create\`.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else {
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .addFields(
                    {
                        name: "Imię",
                        value: profileSettings.imie || "Nie podano"
                    },
                    {
                        name: "Wiek",
                        value: profileSettings.wiek || "Nie podano"
                    },
                    {
                        name: "Status miłosny",
                        value: `${profileSettings.statusMilosny}`.replace("wolny", "Wolny").replace("zajety", "Zajęty") || "Nie podano"
                    },
                    {
                        name: "YouTube",
                        value: profileSettings.youtube || "Nie podano"
                    },
                    {
                        name: "GitHub",
                        value: profileSettings.github || "Nie podano"
                    },
                    {
                        name: "Instagram",
                        value: profileSettings.instagram || "Nie podano"
                    },
                    {
                        name: "Facebook",
                        value: profileSettings.facebook || "Nie podano"
                    },
                    {
                        name: "WhatsApp",
                        value: profileSettings.whatsapp || "Nie podano"
                    }
                )
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setColor(0x58ABFF)
                message.channel.send(e)
            }
        } catch (err) {
            console.error(err)
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
        } else if (akcja === "create") try {
            if (profileSettings) {
                err = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Posiadasz już profil.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else {
                const newConf = new profileConf({
                    _id: mongo.Types.ObjectId(),
                    userID: message.author.id,
                    imie: "Nie podano",
                    wiek: "Nie podano",
                    status: "Nie podano",
                    youtube: "Nie podano",
                    github: "Nie podano",
                    instagram: "Nie podano",
                    facebook: "Nie podano",
                    whatsapp: "Nie podano"
                })
                newConf.save()
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie stworzono Twój profil. Możesz go zobaczyć pod komendą \`${prefix}profil show\` lub / i edytować za pomocą \`${prefix}profil edit [imie / wiek / status / youtube / github / instagram / facebook / whatsapp] [nowa treść]\`.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            }
        } catch (err) {
            console.error(err)
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
        } else if (akcja === "edit") try {
            if (!profileSettings) {
                err = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Nie posiadasz profilu. Możesz go stworzyć za pomocą komendy \`${prefix}profil create\`.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (!ust || !opcja) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}profil <show / edit> <imie / wiek / status / youtube / github / instagram / facebook / whatsapp> <nowa treść>` + "`")
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (opcja === "imie") {
                await profileSettings.updateOne({
                    imie: ust
                })
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie ustawiono imię na ${ust}.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            } else if (opcja === "wiek") {
                function checkN(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }
                if (!checkN(ust)) {
                    err = new Discord.MessageEmbed()
                    .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                    .setDescription(`Podaj prawidłowy wiek.`)
                    .setColor(0xFF3F3F)
                    message.channel.send(err)
                } else {
                    await profileSettings.updateOne({
                        wiek: ust
                    })
                    e = new Discord.MessageEmbed()
                    .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                    .setDescription(`Pomyślnie ustawiono wiek na ${ust} lat.`)
                    .setColor(0x58ABFF)
                    message.channel.send(e)
                }
            } else if (opcja === "status") {
                if (ust == "wolny" || ust == "zajety") {
                    await profileSettings.updateOne({
                        statusMilosny: ust
                    })
                    e = new Discord.MessageEmbed()
                    .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                    .setDescription(`Pomyślnie ustawiono status miłosny na ${ust}.`)
                    .setColor(0x58ABFF)
                    message.channel.send(e)
                } else {
                    err = new Discord.MessageEmbed()
                    .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                    .setDescription(`Masz do wyboru 2 opcje: \`wolny\` i \`zajety\`.`)
                    .setColor(0xFF3F3F)
                    message.channel.send(err)
                }
            } else if (opcja === "youtube") {
                await profileSettings.updateOne({
                    youtube: ust
                })
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie ustawiono konto YouTube na ${ust}.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            } else if (opcja === "github") {
                await profileSettings.updateOne({
                    github: ust
                })
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie ustawiono konto GitHub na ${ust}.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            } else if (opcja === "instagram") {
                await profileSettings.updateOne({
                    instagram: ust
                })
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie ustawiono konto Instagram na ${ust}.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            } else if (opcja === "facebook") {
                await profileSettings.updateOne({
                    facebook: ust
                })
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie ustawiono konto Facebook na ${ust}.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            } else if (opcja === "whatsapp") {
                await profileSettings.updateOne({
                    whatsapp: ust
                })
                e = new Discord.MessageEmbed()
                .setAuthor("Profil", "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png")
                .setDescription(`Pomyślnie ustawiono konto WhatsApp na ${ust}.`)
                .setColor(0x58ABFF)
                message.channel.send(e)
            }
        } catch (err) {
            console.error(err)
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