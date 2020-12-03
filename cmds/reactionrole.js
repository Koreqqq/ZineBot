// const Discord = require("discord.js")
// const { MessageEmbed } = require("discord.js")
// const OwnerID = "744935304271626258"
// const os = require("os")
// const moment = require("moment")
// const ut = require("util")
// const ms = require("ms")
// const mongo = require("mongoose")
// const conf = require("../model/guildConfig.js")
// const { wersjaBota } = require("../conf/vars.js")

// module.exports = {
//     name: "reactionrole",
//     description: "Tworzy, edytuje lub usuwa reaction role",
//     aliases: ["e"],
//     category: "<:dscstaff:757997223891042395> Developerskie",
//     usage: "<add / edit / remove> <id wiadomości>",

//     async run(message, args, client) {
//         const settings = await conf.findOne({
//             guildID: message.guild.id
//           }, (err, guild) => {
//             if (err) console.error(err)
//             if (!guild) {
//                 const newConf = new conf({
//                     _id: mongo.Types.ObjectId(),
//                     guildID: message.guild.id,
//                     prefix: "-",
//                     suggestionsChannel: undefined,
//                     announceChannel: undefined,
//                     announceMention: undefined
//                 })
      
//                 newConf.save()
//                 .catch(err => console.error(err))
//             }
//         });
//         const prefix = settings.prefix
//         if(args.split(/\s+/).length !== 1) {
//             let msg = await message.channel.send("Too many arguments. Must only provide 1 message id");
//         }
//     }
// }