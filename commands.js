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
    var simpleGit = require('simple-git');
}
catch(e){
    console.log("You're missing 'simple-git' from your dependencies! Surely you want this bot to update, right?");
	process.exit();
}

try{
	var auth = require("./auth.json");
}

catch(e){
	console.log("You aren't getting very far without an 'auth.json'... just sayin'.");
	process.exit();
}

try {
    var randomHexColor = require('random-hex-color');
}
catch(e){
    console.log("No 'random-hex-color'? No fancy embed colors then.");
	process.exit();
}
try {
	var random = require('random-number-generator');
}
catch(e) {
	console.log("How will I win at the casino if I don't have 'random-number-generator'?")
	process.exit();
}
var client = new Discord.Client();
var os = require("os");
function waitSeconds(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
}
exports.commands = {
    "mod": {
        description: "All commands useful for moderation and debugging of the bot.",
        help: "!help mod",
        commands: {
           "ping": {
               usage: "!ping", 
               description: "I'll respond with a \"pong.\" Useful for checking if I'm alive.", 
               process: function(bot, msg, params, choice){ 
                   msg.channel.send("Pong!").then(m => m.edit(`Pong! | Took ${m.createdTimestamp - msg.createdTimestamp}ms`)) //This will show how fast the bot is responding
               } 
            }, 
            "stats": {
                usage: "!stats",
                description: "Returns stats about the selfbot & the system it is being run on.",
                process: function(client, msg, params, choice){
                    var infoEmbed = new Discord.RichEmbed();
                    infoEmbed.setAuthor("Stats", client.user.avatarURL);
                    infoEmbed.setColor(randomHexColor());
                    infoEmbed.addField("Operating System", os.platform());
                    infoEmbed.addField("Memory", "**Free: **" + Math.round(os.freemem()/1024/1024) + "MB\r\n**Total: **" + Math.round(os.totalmem()/1024/1024) + "MB");
                    infoEmbed.addField("Architecture", os.arch());
                    infoEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                    infoEmbed.setTimestamp();
                    msg.channel.send("", { embed: infoEmbed});
                }
            },
            "update": {
                usage: "!update",
                description: "Will check if there is a new updated available. If update is found, will attempt to restart with the new code.",
                process: function(client, msg, params, choice){
                    if(client.voiceConnection){
                        client.voiceConnection.destroy();
                    }
                    msg.channel.send("Checking for updates...");
                    simpleGit().pull(function(error, update) {
                        if(update && update.summary.changes) {
                            msg.channel.send("Be right back!").then(message => {
                                exec('node selfbit.js', (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`exec error: ${error}`);
                                        return;
                                    }
                                    console.log(`stdout: ${stdout}`);
                                    console.log(`stderr: ${stderr}`);
                                });
                                client.destroy();
                            }).catch(console.log);
                        }
                        else{
                            msg.channel.send("Already up to date.");
                            console.log(error);
                        }
                    });
                }
            },
            "avatar": {
                usage: "!info @Ahead#5477' or !info",
                description: "Will give information about the requested user or the author of the message.",
                process: function(bot, msg, params, choice){
                    var options = params.split(" ");
                    var regMention = /^<[@\w]+>$/;
                    if(params == ""){
                        var avatarEmbed = new Discord.RichEmbed();
                        avatarEmbed.setAuthor(msg.author.username + "'s Avatar", msg.author.avatarURL);
                        avatarEmbed.setImage(msg.author.avatarURL);
                        avatarEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                        avatarEmbed.setColor(randomHexColor());
                        avatarEmbed.setTimestamp();
                        msg.channel.send("", { embed: avatarEmbed });
                    }
                    else if(regMention.exec(options[0]) != null){
                        user = msg.guild.members.get(options[0].replace(/[^\w\s]/gi, ''));
                        var toAuthor = user.nickname != null ? user.nickname : user.user.username;
                        var avatarEmbed = new Discord.RichEmbed();
                        avatarEmbed.setAuthor(user.user.username + "'s Avatar", msg.author.avatarURL);
                        avatarEmbed.setColor(randomHexColor());
                    avatarEmbed.setImage(user.user.avatarURL);
                    avatarEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                        avatarEmbed.setTimestamp();
                        msg.channel.send("", { embed: avatarEmbed });
                    }
                }
            },
            "server": {
                usage: "!server",
                description: "Will give information about the current server.",
                process: function(bot, msg, params, choice){
                    var serverEmbed = new Discord.RichEmbed();
                    serverEmbed.setAuthor("Server Info", msg.author.avatarURL);
                    serverEmbed.setTitle(msg.guild.name);
                    serverEmbed.setColor(randomHexColor());
                    serverEmbed.setDescription(msg.guild.memberCount + " members");
                    serverEmbed.setThumbnail(msg.guild.iconURL);
                    serverEmbed.addField("ID", msg.guild.id);
                    serverEmbed.addField("Created On", msg.guild.createdAt);
                    serverEmbed.addField("Owner", msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator);
                    serverEmbed.addField("Region", msg.guild.region);
                    msg.channel.send("", { embed: serverEmbed });
                }
            },
			"roll": { 
				usage: "!roll number or !roll",
				description: "Rolls a die with the given number of heads, or 6.",
				process: function(bot, msg, params, choice){
					var rollAEmbed = new Discord.RichEmbed();
					rollAEmbed.setAuthor("Die Roll", msg.author.avatarURL);
					rollAEmbed.addField("Rolling...", "<:dieA:365356921290489856>");
					rollAEmbed.setColor("#990000");
					rollAEmbed.setFooter(msg.author.username, msg.author.avatarURL);
					rollAEmbed.setTimestamp();
					
					var rollBEmbed = new Discord.RichEmbed();
					rollBEmbed.setAuthor("Die Roll", msg.author.avatarURL);
					rollBEmbed.addField("Rolling...", "<:dieB:365356948477968384>");
					rollBEmbed.setColor("#990000");
					rollBEmbed.setFooter(msg.author.username, msg.author.avatarURL);
					rollBEmbed.setTimestamp();
					
					var rollCEmbed = new Discord.RichEmbed();
					rollCEmbed.setAuthor("Die Roll", msg.author.avatarURL);
					rollCEmbed.addField("Rolling...", "<:dieD:365356948763443210>");
					rollCEmbed.setColor("#990000");
					rollCEmbed.setFooter(msg.author.username, msg.author.avatarURL);
					rollCEmbed.setTimestamp();
					
					var rollDEmbed = new Discord.RichEmbed();
					rollDEmbed.setAuthor("Die Roll", msg.author.avatarURL);
					rollDEmbed.addField("Rolling...", "<:dieC:365356948746403840>");
					rollDEmbed.setColor("#990000");
					rollDEmbed.setFooter(msg.author.username, msg.author.avatarURL);
					rollDEmbed.setTimestamp();
					
					var rollFinishEmbed = new Discord.RichEmbed();
					rollFinishEmbed.setAuthor("Die Roll", msg.author.avatarURL);
					if(!params) {
						rollFinishEmbed.addField("Results", "<:dieA:365356921290489856> " + msg.author.username + " rolled a 6 headed die and got " + random(6, 1) + "!");
					} else {
						if(!isNaN(params)){
							rollFinishEmbed.addField("Results", "<:dieA:365356921290489856> " + msg.author.username + " rolled a " + params + " headed die and got " + random(params, 1) + "!");
						} else {
							console.log("someone tried to roll a WORD OH MY GOD");
						}
					}
					rollFinishEmbed.setColor("#990000");
					rollFinishEmbed.setFooter(msg.author.username, msg.author.avatarURL);
					rollFinishEmbed.setTimestamp();
					if(!isNaN(params)){
						msg.channel.send("", { embed: rollAEmbed }).then(m => {
							waitSeconds("500");
							m.edit("", { embed: rollBEmbed});
							waitSeconds("500");
							m.edit("", { embed: rollCEmbed});
							waitSeconds("500");
							m.edit("", { embed: rollDEmbed});
							waitSeconds("500");
							m.edit("", { embed: rollFinishEmbed});
						});
					} else {
						msg.channel.send("I need a number to roll, buddy.");
					}
				}
			},
            "info": {
                usage: "!info @Ahead#5477' or !info",
                description: "Will give information about the requested user or the author of the message.",
                process: function(bot, msg, params, choice){
                    var options = params.split(" ");
                    var regMention = /^<[@\w]+>$/;
                    if(params == ""){
                        var infoEmbed = new Discord.RichEmbed();
                        infoEmbed.setAuthor("User Info", msg.author.avatarURL);
                        infoEmbed.setThumbnail(msg.author.avatarURL); infoEmbed.setColor(randomHexColor());
                        infoEmbed.setTitle(msg.author.username + "#" + msg.author.discriminator);
                        if (msg.author.presence.game) {
                            infoEmbed.setDescription(msg.author.presence.game.name);
                        }
                        infoEmbed.addField("ID", msg.author.id);
                        infoEmbed.addField("Account Created", msg.author.createdAt);
                        infoEmbed.addField("Joined Server", msg.member.joinedAt);
                        if(msg.member.nickname) {
                            infoEmbed.addField("Nickname", msg.member.nickname);
                        }
                        infoEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                    infoEmbed.setTimestamp();
                        msg.channel.send("", { embed: infoEmbed });
                    }
                    else if(regMention.exec(options[0]) != null){
                        user = msg.guild.members.get(options[0].replace(/[^\w\s]/gi, ''));
                        var toAuthor = user.nickname != null ? user.nickname : user.user.username;
                        var infoEmbed = new Discord.RichEmbed();
                        infoEmbed.setAuthor("User Info", msg.author.avatarURL);
                        infoEmbed.setColor(randomHexColor());
                        infoEmbed.setTitle(user.user.username + "#" + user.user.discriminator);
                        if (user.user.presence.game) {
                            infoEmbed.setDescription("Playing **" + user.user.presence.game.name + "**");
                        }
                        infoEmbed.addField("ID", user.user.id);
                        infoEmbed.addField("Account Created", user.user.createdAt);
                        infoEmbed.setThumbnail(user.user.avatarURL);
                        infoEmbed.addField("Joined Server", user.joinedAt);
                        if(user.nickname) {
                            infoEmbed.addField("Nickname", user.nickname);
                        }
                        infoEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                    infoEmbed.setTimestamp();
                        msg.channel.send("", { embed: infoEmbed });
                    }
                }
            }
        }
    }
}
