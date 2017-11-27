try { 
    var package = require("./package.json");
    console.log("\x1b[5m\x1b[36m", "Selfbit", "\x1b[35m", "version " + package.version, "\x1b[0m");
}
catch (e) {
    console.log("Hmm... no 'package.json'... are you a pirate?");
}

try {
    var Discord = require("discord.js");
}

catch (e) {
    console.log(e.stack);
    console.log(process.version);
    console.log("I think there is a complete lack of everything here... I mean, do you even want to start? There is no 'discord.js.'");
    process.exit();
}

try{
    var auth = require("./auth.json");
}

catch(e){
    console.log("You aren't getting very far without an 'auth.json'... just sayin'.");
}

try{
    var commands = require('./commands.js').commands;
}
catch(e){
    console.log("You see, if you don't have a 'commands.js', you can't really command me to do things...");
    console.log(e);
}

try {
    var randomHexColor = require('random-hex-color');
}
catch(e){
    console.log("No 'random-hex-color'? No fancy embed colors then.");
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

var client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", function (msg) {
  if (msg.author.id == auth.client && msg.content[0] === "!") {
      var msgcmd = msg.content.split(" ")[0].substring(1);
      var params = msg.content.substring(msgcmd.length + 2);
      for(var module in commands){
          for(var cmnd in commands[module].commands){
              if(cmnd == msgcmd){
                  var cmd = commands[module].commands[msgcmd];
                  break;
              }
          }
      }
      if(msgcmd == "eval"){
          if(msg.author.id == auth.client){
              console.log("Evaluating code: " + params);
              try {
                  let startTime = Date.now();
                  var evaled = eval(params);
                  let timePassed = Date.now() - startTime;
                  if(typeof evaled !== "string"){
                      evaled = require("util").inspect(evaled);
                  }

                  var evalEmbed = new Discord.RichEmbed();
                  evalEmbed.setAuthor("Eval", client.user.avatarURL);
                  evalEmbed.setTitle("SUCCESS\r");
                  evalEmbed.setColor("#00CC00");
                  evalEmbed.addField("Input", "```" + params + "```");
                  evalEmbed.addField("Output", "```" + evaled + "```");
                  evalEmbed.addField("Elapsed Time", "```" + timePassed + "ms```");
                  evalEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                  evalEmbed.setTimestamp();
                  msg.channel.send("", { embed: evalEmbed});
              }
              catch(err) {
                  var evalEmbed = new Discord.RichEmbed();
                  evalEmbed.setAuthor("Eval", client.user.avatarURL);
                  evalEmbed.setTitle("ERROR\r");
                  evalEmbed.setColor("#990000");
                  evalEmbed.addField("Input", "```" + params + "```");
                  evalEmbed.addField("Output", "```" + clean(err) + "```");
                  evalEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                  evalEmbed.setTimestamp();
                  msg.channel.send("", { embed: evalEmbed});
              }

              return;
          }

          console.log("someone tried to do it");
      }
      else if(cmd) {
            console.log("treating " + msg.content + " from " + msg.author + " as command");
            var choice = Math.floor((Math.random() * 9));
            cmd.process(client, msg, params, choice);
      }
      else {
            return;
      }
    }
});
client.login(auth.token);
