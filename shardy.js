const { ShardingManager } = require("discord.js");
const { format } = require("moment")
const chalk = require("chalk")
const pm2 = require("pm2")
const moment = require("moment")
const config = require("./config.json")
const shard = new ShardingManager(`./index.js`, {
    token: config.private.token,
    autoSpawn: true,
    totalShards: 3
})

shard.spawn();
shard.on("shardCreate", shard => console.log(chalk.redBright(`[SHARD] Uruchomiono shard ${shard.id}`)))