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
const { prefix } = require("../conf/vars.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "giveaway",
    description: "Tworzy nowy giveaway.",
    aliases: ["gcreate", "gstart"],
    category: ":newspaper: Przydatne",
    usage: "<czas, np. 2h> [kanał] <nagroda>",

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
      ep = new Discord.MessageEmbed()
      .setAuthor("Brak uprawnień", "https://emoji.gg/assets/emoji/1665_disagree.png")
      .setDescription(`Potrzebujesz uprawnienia \`Zarządzanie serwerem\`, aby użyć tej komendy.`)
      .setColor(0xFF3F3F)
      if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(ep)
        if (!args[0]) {
          err = new Discord.MessageEmbed()
          .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
          .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}giveaway <czas, np. 2h> [kanał] <nagroda>` + "`")
          .setColor(0xFF3F3F)
          message.channel.send(err)
        }
      if (
        !args[0].endsWith("d") &&
        !args[0].endsWith("h") &&
        !args[0].endsWith("m")
      ) {
        err = new Discord.MessageEmbed()
        .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
        .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}giveaway <czas, np. 2h> [kanał] <nagroda>` + "`")
        .setColor(0xFF3F3F)
        message.channel.send(err)
      }
      if (isNaN(args[0][0])) {
        err = new Discord.MessageEmbed()
        .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
        .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}giveaway <czas, np. 2h> [kanał] <nagroda>` + "`")
        .setColor(0xFF3F3F)
        message.channel.send(err)
      }
      let channel = message.mentions.channels.first();
      if (!channel) channel == message.channel
      let nagroda = args.slice(2).join(" ");
      if (!nagroda) {
        err = new Discord.MessageEmbed()
        .setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
        .setDescription(`Podałeś za mało argumentów.\nPrawidłowe użycie komendy:` + "`" + `${prefix}giveaway <czas, np. 2h> [kanał] <nagroda>` + "`")
        .setColor(0xFF3F3F)
        message.channel.send(err)
      }
      client.giveawaysManager.start(channel, {
        time: ms("1000"),
        prize: "test",
        winnerCount: '1',
        hostedBy: message.author,

        messages: {
            giveaway: "GIVEAWAY",
            giveawayEnded: "GIVEAWAY ENDED",
            timeRemaining: "Time remaining: **{duration}**",
            inviteToParticipate: "React with 🎉 to enter",
            winMessage: "Congrats {winners}, you won **{prize}**",
            embedFooter: "Giveaway time!",
            noWinner: "Couldn't determine a winner",
            hostedBy: "Hosted by {user}",
            winners: "winner(s)",
            endedAt: "Ends at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    })

    message.channel.send(`Giveaway starting in ${channel}`);
    }
	}