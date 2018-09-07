const request = require('request');
const fs = require('fs');
const Discord = require('discord.js');

var rawData = fs.readFileSync('services.json')
var object = JSON.parse(rawData)
var promises = new Array()

function check(service, name) {
   
    let url = `https://api.getpenguin.com/check/${service}/${name}`;
    return new Promise((resolve, reject) => {
      request.get(url, {json: true}, function (err, res, data) {
        if (res.statusCode == 200) {
          resolve(data)
        } else {
          reject(err)
        }
      });
    })

}

exports.run = (client, message, args, config) => {
  

  if(!args || args.length < 1) return message.reply("Must provide a username or domain to check.");
  if(!fs.existsSync('services.json')) { request('https://api.getpenguin.com/check/services').pipe(fs.createWriteStream('services.json')); }
  var name = args[0];

  for ( var i = 0 ; i < object.services.length ; i++ ) {
    var promise = check(object.services[i], name);
    promises.push(promise);
  }

  Promise.all(promises).then(function(statuses) {
    const embed = new Discord.RichEmbed()
    .setTitle(name)
    .setAuthor(client.user.username, client.user.avatarURL)
    .setColor(0x00AE86)
    .setDescription("Is this username or domain available?")
    .setTimestamp();
    statuses.forEach(function (obj) {
      embed.addField(obj.service, obj.status, true);
    });

    message.channel.send({embed});
    promises = new Array();
  }).catch(function(err) {
    console.log('error creating embed')
  });

  
};