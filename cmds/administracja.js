const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const ut = require("util")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "administracja",
    description: "Informacje o administracji bota",
    aliases: ["dev", "adm", "ekipa", "staff"],

    async run(message, args, client) {
        e = new MessageEmbed()
        .setAuthor("Administracja bota", "https://icon2.cleanpng.com/20180728/ckb/kisspng-faculty-clip-art-staff-icon-5b5c6243352a84.1327378115327811232178.jpg")
        .addField("<:dscstaff:766927328172310528> Developerzy", `<@${OwnerID}> (\`!NotSador.DEV#4999\`)`)
        .addField("<:x_:757581283982442506> Moderatorzy", "<@520274073167593483> (\`!xKamiXX#7148\`),\n<@518123941919981569> (\`AsteL#1518\`),\n<@644881718112681985> (\`LefeQ#3213\`)")
        .addField("<:bughunter_lvl2:766927327711723522> Pomocnicy", "<@696424326320095294> (\`unixKid#5738\`)")
        .addField("<:earlysupporter:766927327845548043> Wspierający", "Brak")
        .setColor("#58ABFF")
        .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        message.channel.send(e);
    }
}