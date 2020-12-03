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
    name: "botinfo",
    description: "Informacje o bocie",
	aliases: ["boti", "b-i", "bot", "bi"],

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
        const core = os.cpus()[0]
        
        /* UPTIME */
        let sekL = (client.uptime / 1000)
        let dni = Math.floor(sekL / 86400)
        sekL %= 86400
        let godziny = Math.floor(sekL / 3600)
        sekL %= 3600
        let minuty = Math.floor(sekL / 60)
        let sekundy = Math.floor(sekL % 60)

		embed = new Discord.MessageEmbed()
		.setAuthor("Informacje o bocie", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1200px-Infobox_info_icon.svg.png")
		.setColor("#58ABFF")
        .addFields(
            {
                name: "Mój tag",
                value: `${client.user.tag}`
            },
            {
                name: "Ping",
                value: `${client.ws.ping}`
            },
            {
                name: "Liczba komend",
                value: `${client.commands.size}`
            },
            {
                name: "Serwery (łącznie)",
                value: `${await client.shard.fetchClientValues(`guilds.cache.size`).then(res => res.reduce((acc, guildCount) => acc + guildCount, 0))}`
            },
            {
                name: "Serwery (względem shardów) [Shard 1 | Shard 2 | Shard 3]",
                value: `${await client.shard.fetchClientValues(`guilds.cache.size`)}`.replace(/,/g, " | ")
            },
            {
                name: "Wersja node.js",
                value: `${process.version}`
            },
            {
                name: "Wersja bota",
                value: `${wersjaBota}`
            },
            {
                name: "Wersja discord.js",
                value: `${Discord.version}`
            },
            {
                name: "Uptime",
                value: `${dni} dni, ${godziny} godzin, ${minuty} minut, ${sekundy} sekund`
            },
            {
                name: "Rdzenie procesora",
                value: `${os.cpus().length}`
            },
            {
                name: "Model procesora",
                value: `${core.model}`
            },
            {
                name: "Szybkość procesora",
                value: `${core.speed}MHz`
            },
        )
        .setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        message.channel.send(embed);
	}
}