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
    name: "skonfiguruj",
    description: "Konfigurowanie serwera [BETA]",
    aliases: ["c", "conf", "config", "konfig", "konfiguruj", "sett", "settings", "ustawienia"],
    category: ":newspaper: Przydatne",
    usage: "<set / show> <opcja> <nowe ustawienie>",

    async run(message, args, client) {
        const akcja = args[0]
        const opcja = args[1]
        const ustawienie = [...args].slice(2).join(" ")
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
        if (!akcja) {
            err = new Discord.MessageEmbed()
            .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${settings.prefix}skonfiguruj <set / show> <opcja> <nowe ustawienie>` + "`")
            .setColor(0xFF3F3F)
            message.channel.send(err)
        } else if (akcja === "show") try {
            const show = new MessageEmbed()
            .setColor("#75FF67")
            .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
            .setDescription(`W tym oknie możesz zobaczyć konfigurację serwera.\nAby zmienić konkretne ustawienie użyj \`${settings.prefix}skonfiguruj set <nazwa ustawienia> <wartość nowego ustawienia>\`.\nPrzykład: \`${settings.prefix}skonfiguruj set prefix %\`.\nAby usunąć ustawienie z bazy użyj: \`${settings.prefix}skonfiguruj set <nazwa ustawienia> off\`. Pamiętaj, że nie wszystkie ustawienia można wyłączać! (np. prefix)`)
            .addFields(
                {
                    name: "Prefix (\`prefix\`)",
                    value: settings.prefix || "-"
                },
                {
                    name: "Kanał propozycji (\`suggestionsChannel\`)",
                    value: settings.kanalPropozycji || "Nie ustawiono"
                },
                {
                    name: "Kanał ogłoszeń (\`announcementChannel\`)",
                    value: settings.kanalOgloszen || "Nie ustawiono"
                },
                {
                    name: "Wzmianka ogłoszeń (\`announcementMention\`)",
                    value: settings.wzmiankaOgloszen || "Nie ustawiono"
                }
            )
            .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            message.channel.send(show);
        } catch (err) {
            emb = new Discord.MessageEmbed()
            .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Wystąpił błąd`)
            .setColor(0xFF3F3F)
            message.channel.send(emb)
        } else if (akcja === "set") try {
            if (!message.member.hasPermission("MANAGE_GUILD")) {
                ep = new Discord.MessageEmbed()
                .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Potrzebujesz uprawnienia \`Zarządzanie serwerem\`, aby użyć tej komendy.`)
                .setColor(0xFF3F3F)
                message.channel.send(ep)
            } else if (!opcja || !ustawienie) {
                err = new Discord.MessageEmbed()
                .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
                .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${settings.prefix}skonfiguruj <set / show> <opcja> <nowe ustawienie>` + "`")
                .setColor(0xFF3F3F)
                message.channel.send(err)
            } else if (opcja === "prefix") {
                if (ustawienie.length > 3) {
                    emb = new Discord.MessageEmbed()
                    .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                    .setDescription(`Prefix nie może być dłuższy niż 3 znaki`)
                    .setColor(0xFF3F3F)
                    message.channel.send(emb)
                }  else {
                    await settings.updateOne({
                        prefix: ustawienie
                    })
                    const e1 = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                    .setDescription(`Pomyślnie zmieniono prefix na ${ustawienie}.`)
                    .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(e1);
                }
            } else if (opcja === "suggestionsChannel") {
                const kanal = message.mentions.channels.first()
                if (!kanal) {
                    if (ustawienie === "off") {
                        await settings.updateOne({
                            kanalPropozycji: undefined
                        })
                        const e2 = new MessageEmbed()
                        .setColor("#75FF67")
                        .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                        .setDescription(`Pomyślnie usunięto kanał propozycji z bazy.`)
                        .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                        message.channel.send(e2);
                    } else {
                        emb = new Discord.MessageEmbed()
                        .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                        .setDescription(`Nie znaleziono takiego kanału`)
                        .setColor(0xFF3F3F)
                        message.channel.send(emb)
                    }
                } else {
                    await settings.updateOne({
                        kanalPropozycji: `${kanal}`
                    })
                    const e2 = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                    .setDescription(`Pomyślnie zmieniono kanał propozycji na ${kanal}.`)
                    .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(e2);
                }
            } else if (opcja === "announcementChannel") {
                const annChn = message.mentions.channels.first()
                if (!annChn) {
                    if (ustawienie === "off") {
                        await settings.updateOne({
                            kanalOgloszen: undefined
                        })
                        const e = new MessageEmbed()
                        .setColor("#75FF67")
                        .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                        .setDescription(`Pomyślnie usunięto kanał ogłoszeń z bazy.`)
                        .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                        message.channel.send(e);
                    } else {
                        emb = new Discord.MessageEmbed()
                        .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                        .setDescription(`Nie znaleziono takiego kanału`)
                        .setColor(0xFF3F3F)
                        message.channel.send(emb)
                    }
                } else {
                    await settings.updateOne({
                        kanalOgloszen: `${annChn}`
                    })
                    const e = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                    .setDescription(`Pomyślnie ustawiono kanał ogłoszeń na ${annChn}.`)
                    .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(e);
                }
            } else if (opcja === "announcementMention") {
                const rola = ustawienie.replace("<@&", "").replace(">", "")
                const mntn = message.guild.roles.cache.get(rola)
                if (!mntn) {
                    if (ustawienie === "off") {
                        await settings.updateOne({
                            wzmiankaOgloszen: undefined
                        })
                        const e = new MessageEmbed()
                        .setColor("#75FF67")
                        .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                        .setDescription(`Pomyślnie usunięto wzmiankę ogłoszeń z bazy.`)
                        .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                        message.channel.send(e);
                    } else {
                        emb = new Discord.MessageEmbed()
                        .setAuthor("Błąd", "https://emoji.gg/assets/emoji/1665_disagree.png")
                        .setDescription(`Nie znaleziono takiej rangi`)
                        .setColor(0xFF3F3F)
                        message.channel.send(emb)
                    }
                } else {
                    await settings.updateOne({
                        wzmiankaOgloszen: `${mntn}`
                    })
                    const e = new MessageEmbed()
                    .setColor("#75FF67")
                    .setAuthor("Konfiguracja", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1f80c78a-4070-4082-85ed-f2d4cf3894db/d88y06v-9bf586ed-3aa1-42b8-8ca5-343fc26843a2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMWY4MGM3OGEtNDA3MC00MDgyLTg1ZWQtZjJkNGNmMzg5NGRiXC9kODh5MDZ2LTliZjU4NmVkLTNhYTEtNDJiOC04Y2E1LTM0M2ZjMjY4NDNhMi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.Juca_nISDIHwHAM6Cfds27JtZINIrJs-zwFwSXGT1lY")
                    .setDescription(`Pomyślnie ustawiono wzmiankę ogłoszeń na ${mntn}.`)
                    .setFooter(`Zmiany dokonał ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    message.channel.send(e);
                }
            }
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