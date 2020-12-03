const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const OwnerID = "744935304271626258"
const os = require("os")
const moment = require("moment")
const utils = require("util")
const pag = require("discord.js-pagination")
const ms = require("ms")
const mongo = require("mongoose")
const conf = require("../model/guildConfig.js")
const { wersjaBota } = require("../conf/vars.js")

module.exports = {
    name: "pomoc",
	description: "Lista wszystkich komend",
	aliases: ["h", "help", "cmd", "cmds", "cmdlist", "commandlist", "lista", "listakomend"],
	usage: "[komenda]",
	botPermissions: ["ADD_REACTIONS", "SEND_MESSAGES"],

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
        if (args[0]) {
			const komenda = client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(args[0]),
			) || client.commands.get(args[0])
	  
			if (!komenda) {
				e = new MessageEmbed()
				.setAuthor("Error", "https://emoji.gg/assets/emoji/1665_disagree.png")
				.setDescription(`Nie znaleziono komendy \`${args[0]}\`!`)
				.setColor(0xFF3F3F)
			  return message.channel.send(e);
			}

			const aliasy = komenda.aliases
			embed = new MessageEmbed()
			.setColor("#F0FF6E")
			.setAuthor("Szczegółowe informacje o komendzie", "https://cdn.discordapp.com/emojis/758701017117229097.png?v=1")
			.setDescription("<> - argument obowiązkowy\n[] - argument opcjonalny")
			.addField("Nazwa", komenda.name)
			.addField("Opis", komenda.description || "Brak")
			.addField("Aliasy", aliasy || "Brak aliasów")
			.addField("Użycie komendy", komenda.usage || "Brak")
			.addField("Kategoria", komenda.category || "Brak")
			.setFooter(`Wywołano na życzenie ${message.author.tag} (${message.author.id})`, `${message.author.displayAvatarURL({ dynamic: true })}`)
	  
            return message.channel.send(embed);
        } else {
            const glowny = new MessageEmbed()
			.setColor("#58ABFF")
			.setAuthor("Potrzebujesz pomocy?", "https://cdn.discordapp.com/emojis/758701017117229097.png?v=1")
			.setDescription(`Witaj w interaktywnym menu pomocy!\nZnajdziesz tu niezbędne informacje na temat wszystkich komend bota.`)
            .addField("Informacje", `Prefix bota: \`${prefix}\`\nIlość komend: **${client.commands.size}**\nInformacje o konkretnej komendzie: ${prefix}pomoc <komenda>\n\nAby poruszać się pomiędzy poszczególnymi stronami komend użyj reakcji ⬅ oraz ➡.`, false)
            
            const p1 = new MessageEmbed()
			.setColor("#58ABFF")
			.addField(
				`:no_entry_sign: **Moderacja**`,
				`\`skonfiguruj\`, \`ankieta\`, \`ogloszenie\`, \`ban\`, \`kick\``
			)
			.addField(
				`:camera_with_flash: **Zdjęcia**`,
				`\`koala\`, \`kot\`, \`lis\`, \`pies\`, \`ptak\`, \`supreme\``
			)
			.addField(
				`<:partner:766927327731908639> **Przydatne**`,
				`\`giveaway\`, \`powiedz\`, \`pomoc\`, \`ascii\`, \`calc\`, \`suggest\``
			)
			.addField(
				`<:zabawa:766927241657319425> **Śmieszne**`,
				`\`mem\`, \`8ball\`, \`trump\``
			)
            .addField(
				`<:h_:766927241585360907> **Informacyjne**`,
				`\`userinfo\`, \`botinfo\`, \`staff\`, \`profil\``
			)
            
            const p2 = new MessageEmbed()
			.setColor("#58ABFF")
			.addField(
				`<:verifiedbotdeveloper:766927327472123927> **Developerskie**`,
				`\`eval\`, \`restart\`, \`aktualizacja\`, \`gban\``
			)
			
            const strony = [
                glowny,
                p1,
                p2
            ]
			const emotki = ["⬅", "➡"];
            const timeout = '120000';

            pag(message, strony, emotki, timeout)
        }
}}