require("dotenv").config()

const Discord = require("discord.js")
const cron = require('cron')
const client = new Discord.Client
const CronTime = require('cron').CronTime

var channelID = '1005613288475865120'
var serverID = '1005613287934804018'
var adminID = 'Admin'
var hour = '10' //0-23
var minute = '08' //0-59
var wrong = false


let scheduledMessage = new cron.CronJob(('00 ' + minute + ' ' + hour + ' * * *'), () => {
  const guild = client.guilds.cache.get(serverID)
  const channel = guild.channels.cache.get(channelID)
  channel.send(makeScramble())
});
scheduledMessage.start()

var timeChange = function(timeWanted){
  if(timeWanted.substring(2, 3) === ":"){
    hour = timeWanted.substring(0, 2)
    minute = timeWanted.substring(3)
    scheduledMessage.setTime(new CronTime(('00 ' + minute + ' ' + hour + ' * * *')))
    wrong = false
  } else {
    wrong = true
  }
}

client.once("ready", () => {
  console.log(`Online as ${client.user.tag}`);
});


client.on("message", msg => {
    if(msg.content === "!dsbscramble"){
      if (msg.member.roles.cache.find(r => r.name === adminID)){
        msg.channel.send(makeScramble())
      }
    }
})



client.on("message", msg => {
  if(msg.content === "!dsbdailyon"){
    if (msg.member.roles.cache.find(r => r.name === adminID)){
      scheduledMessage.start()
      msg.channel.send("Daily Scrambles Turned On")
    }
  }
})

client.on("message", msg => {
  if(msg.content === "!dsbdailyoff"){
    if (msg.member.roles.cache.find(r => r.name === adminID)){
      scheduledMessage.stop()
      msg.channel.send("Daily Scrambles Turned Off")
    }
  }
})


client.on("message", msg => {
  if(msg.content === "!dsbhelp"){
    if (msg.member.roles.cache.find(r => r.name === adminID)){
      msg.channel.send("Choose a channel for the daily scrambles to run in, and find the channel ID.\nType !dsbchannel with a space and then the channel ID.\nExample: !dsbchannel 1234567891011.\n\nThen run !dsbdailyon and you will get a scramble every 24 hours in your selected channel.\nType !dsbdailyoff to stop the daily scrambles from happening.\nUse !dsbtime and then the time, in HH:MM format, to set the daily time.\nExample: !dsbtime 14:05 (it uses military time)\n\nIf you just want a scramble, use !dsbscramble.\nIf you want something else, you are using the wrong bot.")
    }
  }
})


client.on("message", msg => {
  if(msg.content.substring(0, 12) === "!dsbchannel "){
    if (msg.member.roles.cache.find(r => r.name === adminID)){
      channelID = msg.content.substring(12)
      msg.channel.send("Channel ID set to " + msg.content.substring(12))
    }
  }
})

client.on("message", msg => {
  if(msg.content.substring(0, 9) === "!dsbtime "){
    if (msg.member.roles.cache.find(r => r.name === adminID)){
      timeChange(msg.content.substring(9))
      if(wrong){
        msg.channel.send("Error. Time formatted incorrectly. Use HH:MM")
      } else {
        
        msg.channel.send("Daily Scramble Time set to " + msg.content.substring(9))
      }
    }
  }
})


function makeScramble() {
    var options = ["F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'"]
    var numOptions = [0, 1, 2, 3, 4, 5] // 0 = F, 1 = R, 2 = U, 3 = B, 4 = L, 5 = D
    var scramble = []
    var scrambleMoves = []
    var output = ""
    var bad = true

    while (bad) {
        scramble = []
        for (var i = 0; i < 20; i++) {
            scramble.push(numOptions[getRandomInt(6)])
        }
        // check if moves directly next to each other involve the same letter
        for (var i = 0; i < 20 - 1; i++) {
            if (scramble[i] == scramble[i + 1]) {
                bad = true
                break
            } else {
                bad = false
            }
        }
    }
    //console.log(scramble)
    // switch numbers to letters
    var move
    for (var i = 0; i < 20; i++) {
        switch (scramble[i]) {
            case 0:
                move = options[getRandomInt(3)] // 0,1,2
                scrambleMoves.push(move)
                break
            case 1:
                move = options[getRandomIntBetween(3, 6)] // 3,4,5
                scrambleMoves.push(move)
                break
            case 2:
                move = options[getRandomIntBetween(6, 9)] // 6,7,8
                scrambleMoves.push(move)
                break
            case 3:
                move = options[getRandomIntBetween(9, 12)] // 9,10,11
                scrambleMoves.push(move)
                break
            case 4:
                move = options[getRandomIntBetween(12, 15)] // 12,13,14
                scrambleMoves.push(move)
                break
            case 5:
                move = options[getRandomIntBetween(15, 18)] // 15,16,17
                scrambleMoves.push(move)
                break
        }
    }
    for (var i = 0; i < 20; i++){
      output = output + (scrambleMoves[i] +  " ")
    }
    return output
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) // returns up to max - 1
}

function getRandomIntBetween(min, max) { // return a number from min to max - 1. Ex. 3, 9 returns 3 - 8
    return Math.floor(Math.random() * (max - min) + min)
}



client.login(process.env.BOT_TOKEN)