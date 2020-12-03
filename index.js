const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const client = new Discord.Client({
    shardId: process.argv[1],
    shardCount: process.argv[2],
    fetchAllMembers: true,
    disableMentions: "everyone"
})
const OwnerID = "349685742529937430"
const mongo = require("mongoose")
const conf = require("./model/guildConfig.js")
const cmdHandler = require("./hdl/cmdh.js")
const config = require("./config.json")

// Ustawienia MongoDB
const ustawieniaDB = {
    useNewUrlParser: true,
    autoIndex: false,
    reconnectTries: 5,
    reconnectInterval: 450,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4
}

// Gdy bot gotowy
client.once("ready", async () => {
    console.log(`${client.user.tag} jest gotowy!`)

    // Na początek
    client.user.setPresence({
        status: "idle",
        activity: {
            name: "123",
            type: 'WATCHING'
        }
    })
    // Potem
    setInterval(async () => {
        client.user.setPresence({
            status: "dnd",
            activity: {
                name: `@Zine | ${await client.shard.fetchClientValues("guilds.cache.size").then(re => re.reduce((a, acc) => a + acc, 0))} serwerów`,
                type: 'WATCHING',
            }
        })
    }, 7000)

    // Logowanie do MongoDB
    mongo.connect(`mongodb+srv://${config.private.dbUsername}:${config.private.dbPassword}@cluster0.grxox.mongodb.net/zine?retryWrites=true&w=majority`, ustawieniaDB)
    mongo.set(`useFindAndModify`, false)
    mongo.success = global.Promise

    mongo.connection.on("connected", () => {
        console.log("[MONGODB] Połączono z MongoDB")
    })
    mongo.connection.on("err", (e) => {
        console.error(e)
    })
    mongo.connection.on("disconnected", () => {
        console.log(`[MONGODB] Rozłączono z bazą`)
    })
})

// Uruchamianie handlerów
cmdHandler(client)

// Prefixy
client.guilds.cache.forEach(id => {
    conf.findOne({
        guildID: id
    }, (e, serv) => {
        if (e) console.error(e)
        if (!serv) {
            const nConf = new conf({
                guildID: id,
                prefix: "-"
            })
            return nConf.save()
        }
    })
})
// Logowanie
client.login(config.private.token)