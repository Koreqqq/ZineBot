const Discord = require("discord.js")
const { readdirSync } = require("fs")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const gbanConf = require("../model/gban.js")
const cmdConf = require("../model/tagi.js")
const { Collection } = require("discord.js")
const ascii = require("ascii-table")
const table = new ascii().setHeading("Komenda", "Status")

module.exports = async (client) => {
  client.commands = new Collection()
  const cooldowns = new Collection()

  const plikiKomend = readdirSync(__dirname + "/../cmds").filter((file) =>
    file.endsWith(".js"),
  )
  const tools = require("../fnc/funkcje.js")
  for (const file of plikiKomend) {
    const komenda = require(__dirname + `/../cmds/${file}`)

    if (komenda.name) {
      client.commands.set(komenda.name, komenda)
      table.addRow(file, "GOTOWE")
    } else {
      table.addRow(file, "BŁĄD!")
      continue
    }
  }
  
  console.log(table.toString())

  client.on("message", async (message) => {
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
    if (message.content.includes("<@!745181618242846762>" || "<@745181618242846762>" || "@Zine#5472")) {
      e = new MessageEmbed()
      .setColor("#58ABFF")
      .setAuthor("Wykryto wzmiankę", "https://cdn.discordapp.com/emojis/758701017117229097.png?v=1")
      .setDescription(`Prefix komend: \`${prefix}\`\nŁączna ilość komend: **${client.commands.size}**\nKomenda pomocy: ${prefix}pomoc\nMój **ping** to: ${client.ws.ping}ms.`)
      .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
      return message.channel.send(e)
    }

    const msg = message.content.replace(prefix, "")
    const cmd2 =
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(msg),
    )

    if (message.author.bot) {
      return
    }
    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)

    const cmdName = args.shift().toLowerCase()

    const cmd =
      client.commands.get(cmdName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(cmdName),
      )
    if (!cmd) return

    /* 
        GLOBALNE BANY - WAŻNE! START
    */
   if (cmd) {
      const gbanSettings = await gbanConf.findOne({
          bannedUserID: message.author.id
      }, (err, not) => {
          if (!not) {
              const newSettings = new gbanConf({
                  _id: mongo.Types.ObjectId(),
                  bannedUserID: message.author.id,
                  status: "Brak bana",
                  powod: "Ten użytkownik nie jest globalnie zbanowany"
              })
              newSettings.save()
            }
        })
        const gbanStatus = gbanSettings.status || "Brak bana"
        if (gbanStatus === "Globalnie zbanowany") {
          err = new Discord.MessageEmbed()
          .setAuthor("Globalny ban", "https://emoji.gg/assets/emoji/1665_disagree.png")
          .setDescription(`Zostałeś globalnie zbanowany, wskutek czego nie możesz użyć __żadnej__ komendy bota.`)
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
          .setColor(0xFF3F3F)
          message.channel.send(err)
          return
        }
    }

    /* END */

    client.on("guildCreate", () => {
      const data = new conf({
        _id: mongo.Types.ObjectId(),
        guildID: message.guild.id,
        prefix: "-",
        kanalPropozycji: undefined,
        kanalOgloszen: undefined,
        wzmiankaOgloszen: undefined
    })
        // Zapisywanie danych
        data.save()
    })
    client.on("guildMemberAdd", (member) => {
      const data = new conf({
        _id: mongo.Types.ObjectId(),
        bannedUserID: member.id,
        status: "Brak bana",
        powod: "Ten użytkownik nie jest globalnie zbanowany!"
    })
        // Zapisywanie danych
        data.save()
    })
    
    if (cmd.guildOnly && !guild) {
      return
    }
    if (cmd.ownerOnly) {
      if (message.author.id !== OwnerID) {
        e = new Discord.MessageEmbed()
          .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
          .setDescription(`Tą komendę może użyć tylko właściciel bota!`)
          .setColor(0xFF3F3F)
          message.channel.send(e)
      }
    }
    if (message.channel instanceof Discord.DMChannel) return
    if (cmd.botPermissions && cmd.botPermissions.length) {
      if (!message.channel.permissionsFor(message.guild.me).has(cmd.botPermissions)) {
          e = new Discord.MessageEmbed()
            .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
            .setDescription(`Nie mam uprawnień do wykonania tej komendy. Potrzebuję: ${cmd.botPermissions.join("`,`",)}.`)
            .setColor(0xFF3F3F)
          message.channel.send(e)
      }
    }
    if (cmd.userPermissions && cmd.userPermissions.length) {
      if (!message.guild.permissionsFor(message.guild.me).has(cmd.userPermissions)) {
        e = new Discord.MessageEmbed()
          .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
          .setDescription(`Nie posiadasz wymaganych uprawnień do użycia tej komendy: ${cmd.userPermissions.join("`,`")}.`)
          .setColor(0xFF3F3F)
          message.channel.send(e)
      }
    }
    if (!cooldowns.has(cmdName)) {
      cooldowns.set(cmdName, new Collection())
    }
    const data = Date.now()
    const timestamps = cooldowns.get(cmdName)
    const cooldown = (cmd.cooldown || 0) * 1000
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldown
      if (data < expirationTime) {
        const timeLeft = (expirationTime - data) / 1000
        e = new Discord.MessageEmbed()
          .setDescription(`Aby użyć tą komendę ponownie musisz odczekać ${timeLeft.toFixed(1)} sekund.`)
          .setAuthor("Ograniczenie czasowe komendy", "https://emoji.gg/assets/emoji/1665_disagree.png")
          .setColor(0xFF3F3F)
          message.channel.send(e)
      }
    }
    timestamps.set(message.author.id, data)
    setTimeout(() => timestamps.delete(message.author.id), cooldown)
  
    try {
      cmd.run(message, args, client, tools)
    } catch (error) {
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
  })
}