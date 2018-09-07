const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const cron = require('node-cron');
const _ = require('lodash');

const config = require("./config.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
   if (msg.author.bot) return;
   if(msg.content.indexOf(config.cmdPrefix) !== 0) return;
 
   const args = msg.content.slice(config.cmdPrefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase().replace('/', '');
 
   try {
     let commandFile = require(`./commands/${command}.js`);
     commandFile.run(client, msg, args, config);
   } catch (err) {
     console.error(err);
   }
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', config.memberLogChannel);
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the Penguin Community, ${member}!`);
});

cron.schedule('0 0 0-23 * * *', function(){
   console.log('running a task every hour');
 });


client.login(config.token);