const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const utils = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const gbanConf = require("../model/gban.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "gban",
    description: "Banuje globalnie wspomnianego użytkownika.",
    usage: "<dodaj / usuń / sprawdz> <użytkownik> [powód]",
    
    async run(message, args, client) {
        const akcja = args[0]
        const uzytkownik = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") || x.user.username === args[1]) || client.users.cache.get(args[1])
        const powod = [...args].slice(2).join(" ") || "Nie podano"
        const settings = await conf.findOne({
            guildID: message.guild.id
          }, (err, srv) => {
            if (!srv) {
                const newConf = new conf({
                    _id: mongo.Types.ObjectId()(),
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
            err = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Tą komendę może użyć tylko właściciel bota!`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (!akcja) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów lub są one niepoprawne.\nPrawidłowe użycie komendy:` + "`" + `${prefix}gban <dodaj / usuń / sprawdz> <ID użytkownika / @użytkownik> [powód]` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (!uzytkownik) {
            err = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie znaleziono takiego użytkownika w pamięci, lub go nie podałeś.`)
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (akcja === "dodaj") {
            const gbanSettings = await gbanConf.findOne({
                bannedUserID: uzytkownik
            }, (err, not) => {
                if (!not) {
                    const newSettings = new gbanConf({
                        _id: mongo.Types.ObjectId(),
                        bannedUserID: `${uzytkownik}`.replace("<@", "").replace(">", ""),
                        status: "Brak bana",
                        powod: "Ten użytkownik nie jest globalnie zbanowany",
                        moderator: "Brak"
                    })
                    newSettings.save()
                }
            })
            const statusGbana = gbanSettings.status
            if (statusGbana === "Brak bana") {
                await gbanSettings.update({
                    bannedUserID: `${uzytkownik}`.replace("<@", "").replace(">", ""),
                    status: "Globalnie zbanowany",
                    powod: powod,
                    moderator: message.author
                })
    
                // NA KANAŁ GBANY
    
                const e_gbanChn = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Zbanowano globalnie", "https://upload.wikimedia.org/wikipedia/commons/1/14/Ban_sign.png")
                .addFields(
                    {
                        name: "Zbanowany",
                        value: `${uzytkownik} (\`${uzytkownik.id}\`)`
                    },
                    {
                        name: "Powód",
                        value: powod
                    },
                    {
                        name: "Moderator",
                        value: message.author
                    }
                )
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                client.channels.cache.get("766300875236048896").send(e_gbanChn)
                        
                // MESS CHN

                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Sukces", "https://upload.wikimedia.org/wikipedia/commons/1/14/Ban_sign.png")
                .setDescription(`Pomyślnie zbanowano globalnie użytkownika ${uzytkownik}.`)
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
    
                // DO USERA
                try {
                    const e_user = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Zostałeś globalnie zbanowany", "https://upload.wikimedia.org/wikipedia/commons/1/14/Ban_sign.png")
                    .addFields(
                        {
                            name: "Powód",
                            value: powod
                        },
                        {
                            name: "Moderator",
                            value: message.author
                        }
                    )
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    client.users.cache.get(uzytkownik.id).send(e_user)
                } catch (err) {
                    const e = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Informacja", "https://upload.wikimedia.org/wikipedia/commons/1/14/Ban_sign.png")
                    .setDescription(`Niestety, nie mogę wysłać prywatnej wiadomości do tego użytkownika.`)
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(e);
                }
            } else {
                err = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Ten użytkownik jest już globalnie zbanowany.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            }
        } else if (akcja === "usuń") {
            const gbanSettings = await gbanConf.findOne({
                bannedUserID: uzytkownik
            }, (err, not) => {
                if (!not) {
                    const newSettings = new gbanConf({
                        _id: mongo.Types.ObjectId()(),
                        bannedUserID: `${uzytkownik}`.replace("<@", "").replace(">", ""),
                        status: "Brak bana",
                        powod: "Ten użytkownik nie jest globalnie zbanowany",
                        moderator: "Brak"
                    })
                    newSettings.save()
                }
            })
            const statusGbana = gbanSettings.status
            if (statusGbana !== "Brak bana") {
                await gbanSettings.update({
                    bannedUserID: `${uzytkownik}`.replace("<@", "").replace(">", ""),
                    status: "Brak bana",
                    powod: "Ten użytkownik nie jest globalnie zbanowany",
                    moderator: "Brak"
                })
        
                // NA KANAŁ GBANY
        
                const e_gbanChn = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Odbanowano globalnie", "https://upload.wikimedia.org/wikipedia/en/6/66/Ban_green_sign.png")
                .addFields(
                    {
                        name: "Odbanowany",
                        value: `${uzytkownik} (\`${uzytkownik}\`)`
                    },
                    {
                        name: "Powód",
                        value: powod
                    },
                    {
                        name: "Moderator",
                        value: message.author
                    }
                )
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                client.channels.cache.get("766300875236048896").send(e_gbanChn)
                        
                // MESS CHN

                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Sukces", "https://upload.wikimedia.org/wikipedia/en/6/66/Ban_green_sign.png")
                .setDescription(`Pomyślnie odbanowano globalnie użytkownika ${uzytkownik}.`)
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);

                // DO USERA
                try {
                    const e_user = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Zostałeś globalnie odbanowany", "https://upload.wikimedia.org/wikipedia/en/6/66/Ban_green_sign.png")
                    .addFields(
                        {
                            name: "Powód",
                            value: powod
                        },
                        {
                            name: "Moderator",
                            value: message.author
                        }
                    )
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    client.users.cache.get(uzytkownik.id).send(e_user)
                } catch (err) {
                    const e = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Informacja", "https://upload.wikimedia.org/wikipedia/en/6/66/Ban_green_sign.png")
                    .setDescription(`Niestety, nie mogę wysłać prywatnej wiadomości do tego użytkownika.`)
                    .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(e);
                }
            } else {
                err = new Discord.MessageEmbed()
                .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Ten użytkownik nie jest globalnie zbanowany.`)
                .setColor(0xFF3F3F)
                message.channel.send(err)
            }
        } else if (akcja === "sprawdz") {
            const gbanSettings = await gbanConf.findOne({
                bannedUserID: uzytkownik
            }, (err, not) => {
                if (!not) {
                    const newSettings = new gbanConf({
                        _id: mongo.Types.ObjectId()(),
                        bannedUserID: `${uzytkownik}`.replace("<@", "").replace(">", ""),
                        status: "Brak bana",
                        powod: "Ten użytkownik nie jest globalnie zbanowany",
                        moderator: "Brak"
                    })
                    newSettings.save()
                }
            })
            const statusGbana = gbanSettings.status
            if (statusGbana === "Globalnie zbanowany") {
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Gban Check", "https://upload.wikimedia.org/wikipedia/commons/f/f6/Lol_question_mark.png")
                .setDescription(`Ten użytkownik **JEST** globalnie zbanowany!`)
                .addFields(
                    {
                        name: "Powód",
                        value: gbanSettings.powod
                    },
                    {
                        name: "Moderator",
                        value: `<@${gbanSettings.moderator}>`
                    }
                )
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
            } else {
                const e = new MessageEmbed()
                .setColor("#75FF67")
                .setAuthor("Gban Check", "https://upload.wikimedia.org/wikipedia/commons/f/f6/Lol_question_mark.png")
                .setDescription(`Ten użytkownik **NIE JEST** globalnie zbanowany!`)
                .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                message.channel.send(e);
            }
        }
    } 
}
