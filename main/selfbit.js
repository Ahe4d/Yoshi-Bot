var fs = require("fs");
var path = require("path");
var os = require("os");

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
    var selfbitConfig = require("../config/config.json");
}

catch(e){
    console.log("You aren't getting very far without a 'config.json'... just sayin'.");
    process.exit();
}
try {
    var clearRequire = require('clear-require');
}
catch(e) {
    console.log("I need you to get 'clear-require', okay?");
    process.exit();
}
try {
    var rhc = require('random-hex-color');
}
catch(e){
    console.log("No 'random-hex-color'? No fancy embed colors then.");
    process.exit();
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
function isEmpty(str) {
    return (!str || 0 === str.length);
}

var client = new Discord.Client({autoReconnect: false});
var modules = [];
loadModules();

function loadModules() {
    modules = [];
    let files = fs.readdirSync("../modules");
    for(let file of files) {
        if(file.startsWith(".")) continue;
        if(!file.endsWith(".js")) continue;
        let filename = "../modules/" + file;
        try {
            clearRequire(filename);
            let module = require.main.require(filename);
            modules.push(module.module);
            console.log("\x1b[34m--- Successfully loaded module " + file + " ---\x1b[0m");
        } catch(error) {
            console.log("\x1b[31m--- Failed to load module " + file + " ---");
            console.error(error);
            console.log("\x1b[0m")
        }
    }
}
console.log("\x1b[36m", "Selfbit", "\x1b[35m", selfbitConfig.version, "\x1b[0m");
console.log("\x1b[36m", "by Ahe4d", "\x1b[35m", "https://github.com/Ahe4d/selfbit", "\x1b[0m");
console.log("\x1b[36m", "Prefix", "\x1b[35m", selfbitConfig.prefix, "\x1b[0m"); 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", function (msg) {
  if (msg.author.id == client.user.id && msg.content.startsWith(selfbitConfig.prefix)) {
      console.log("command???");
      var msgcmd = msg.content.substr(selfbitConfig.prefix.length).split(" ")[0];
      var params = msg.content.substr(selfbitConfig.prefix.length + msgcmd.length + 1);
      for (let module of modules) {
          for (let command in module) {
            if (command == msgcmd) {
              var cmd = module[command];
            }
          }
      }
      if(msgcmd == "help"){
          console.log("treating " + msg.content + " from " + msg.author + " as command");
          var info = "";
          if(!params){
            for(let module of modules) {
              for(let command in module) {
                info += "**" + Object.keys(module) + "**\n";
                if(isEmpty(module[command].help) == true)
                  info += "`" + selfbitConfig.prefix + Object.keys(module) + "`";
                else
                  info += "`" + selfbitConfig.prefix + Object.keys(module) + " " + module[command].help + "`";
                info += "\n" + module[command].description + "\n\n";
              }
            }

              //info += "```";
              var helpListEmbed = new Discord.RichEmbed();

              helpListEmbed.setAuthor("Modules", client.user.avatarURL);
              helpListEmbed.setColor(rhc());
              helpListEmbed.setDescription(info);
              helpListEmbed.setFooter(client.user.username, client.user.avatarURL);
              helpListEmbed.setTimestamp();
              msg.channel.send("", { embed: helpListEmbed});
      }
    }
      else if(msgcmd == "eval"){
          if(params){
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
          } else {
            msg.channel.send("You can't have an empty syntax!");
          }
        } else if(msgcmd == "reload") {
            var reloadEmbed = new Discord.RichEmbed();
            reloadEmbed.setAuthor("Reload", client.user.avatarURL);
            reloadEmbed.setTitle("Reloading modules & commands...");
            reloadEmbed.setColor(rhc());
            reloadEmbed.setFooter(msg.author.username, msg.author.avatarURL);
            reloadEmbed.setTimestamp();
            msg.channel.send("", {embed: reloadEmbed}).then(m => {
              try {
                loadModules();
                reloadEmbed.setTitle("Done!");
                reloadEmbed.addField("Modules", Object.values(modules));
              } catch(err) {
                reloadEmbed.setTitle("ERROR");
                reloadEmbed.addField("Something went wrong!", "```" + err + "```");
              }

              m.edit("", {embed: reloadEmbed});
            });
        }
        else {
            console.log("treating " + msg.content + " from " + msg.author + " as command");
            console.log("this may be working");
            try {
              cmd.process(client, msg, params);
            } catch(err) {
              console.log("YOU MESSED UP LOL: " + err);
            }
        }
    }
});
client.login(selfbitConfig.token);
