//node modules
var Discord = require("discord.js");
var rhc = require("random-hex-color");

//module
exports.module = {
    "avatar": {
        help: "@Ahead#5477 (or just the command)",
        description: "Returns the avatar of the requested user or the author of the message.",
        process: function(client, msg, params){
            var options = params.split(" ");
            var regMention = /^<[@\w]+>$/;
            if(params == ""){
                var avatarEmbed = new Discord.RichEmbed();
                avatarEmbed.setAuthor("User Avatar", msg.author.avatarURL);
                avatarEmbed.setTitle(msg.author.username + msg.author.discriminator);
                avatarEmbed.setColor(rhc());
                avatarEmbed.setImage(msg.author.avatarURL);
                avatarEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                avatarEmbed.setTimestamp();
                msg.channel.send("", { embed: avatarEmbed });
            } else if(regMention.exec(options[0]) != null) {
                user = msg.guild.members.get(options[0].replace(/[^\w\s]/gi, ''));
                var toAuthor = user.nickname != null ? user.nickname : user.user.username;
                var avatarEmbed = new Discord.RichEmbed();
                avatarEmbed.setAuthor("User Avatar", msg.author.avatarURL);
                avatarEmbed.setTitle(user.user.username + user.user.discriminator);
                avatarEmbed.setColor(rhc());
                avatarEmbed.setImage(user.user.avatarURL);
                avatarEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                avatarEmbed.setTimestamp();
                msg.channel.send("", { embed: avatarEmbed });
            }
        }
    }
};
