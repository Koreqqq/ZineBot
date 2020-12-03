const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const utils = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "userinfo",
    description: "Informacje o konkretnym użytkowniku",
    aliases: ["ui"],
    usage: "[ID użytkownika / pełna nazwa użytkownika]",

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
        const flags = {
            DISCORD_EMPLOYEE: '<:dev:766927241631236116>',
            DISCORD_PARTNER: '<:partner:766927327731908639>',
            BUGHUNTER_LEVEL_1: '<:bughunter:766927328244531200>',
            BUGHUNTER_LEVEL_2: '<:bughunter_lvl2:766927327711723522>',
            HYPESQUAD_EVENTS: '<:hypesquadevents:766927327467929601>',
            HOUSE_BRAVERY: '<:bravery:766927327472123945>',
            HOUSE_BRILLIANCE: '<:brilliance:766927327597821963>',
            HOUSE_BALANCE: '<:balance:766927327707136010>',
            EARLY_SUPPORTER: '<:earlysupporter:766927327845548043>',
            VERIFIED_BOT: '<:verifiedbot:766927241710927892>',
            VERIFIED_DEVELOPER: '<:verifiedbotdeveloper:766927327472123927>'
        };
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") || x.user.username === args[0]) || client.users.cache.get(args[0]) || message.member
        const rangi = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const flagiUsera = member.user.flags.toArray();
        const e = new MessageEmbed()
        .setColor("#F0FF6E")
        .setAuthor("Informacje o użytkowniku", "https://emoji.gg/assets/emoji/1618_users_logo.png")
        .addFields(
            {
                name: "Nazwa i tag",
                value: `${member.user.username}#${member.user.discriminator}`
            },
            {
                name: "ID",
                value: `${member.id}`
            },
            {
                name: "Odznaki",
                value: `${flagiUsera.length ? flagiUsera.map(flag => flags[flag]).join(', ') : 'Brak odznak'}`
            },
            {
                name: "Link do avataru",
                value: `[png](${member.user.displayAvatarURL({ dynamic: true, format: "png" })}) | ` +
                `[jpg](${member.user.displayAvatarURL({ dynamic: true, format: "jpg" })}) | ` +
                `[webp](${member.user.displayAvatarURL({ dynamic: true, format: "webp" })})`
            },
            {
                name: "Status",
                value: `${member.user.presence.status}`
            },
            {
                name: "Aktywność",
                value: `${member.user.presence.game || 'Brak'}`
            },
            {
                name: "Data założenia konta na Discordzie",
                value: `${moment.utc(member.user.createdAt).format("YYYY-MM-DD HH:mm:ss")}`
            },
            {
                name: "Data dołączenia do serwera",
                value: `${moment(member.joinedAt).format('YYYY-MM-DD HH:mm:ss')}`
            },
            {
                name: "Najwyższa ranga",
                value: `${member.roles.hoist || 'Brak'}`
            },
            {
                name: "Lista ról",
                value: `${rangi.join(", ") || "Brak ról"}`
            }
        )
        .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        message.channel.send(e);
    }
}