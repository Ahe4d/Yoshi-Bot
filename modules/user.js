//node modules
var Discord = require("discord.js");
var rhc = require("random-hex-color");

//module
exports.module = {
    "user": {
        help: "@Ahead#5477 (or just the command)",
        description: "Gives information about the requested user or the author of the message.",
        process: function(client, msg, params){
            var options = params.split(" ");
            var regMention = /^<[@\w]+>$/;
            let userRoles;
            if(params == ""){
                userRoles = new Discord.Collection(Array.from(msg.member.roles.entries()).sort((a, b) => b[1].position - a[1].position));

                let roles = userRoles.filter((el) => { if (el.name !== '@everyone' && el.managed === false)
                    return true; }).map((el) => { return el; });
                let rolesString = '*none*';
                if (roles.length > 0)
                    rolesString = roles.join(', ');
                var infoEmbed = new Discord.RichEmbed();
                infoEmbed.setAuthor("User Info", msg.author.avatarURL);
                infoEmbed.setThumbnail(msg.author.avatarURL);
                infoEmbed.setColor(rhc());
                if (msg.author.premium)
                    infoEmbed.setTitle("💲 " + msg.author.username + "#" + msg.author.discriminator);
                else
                    infoEmbed.setTitle(msg.author.username + "#" + msg.author.discriminator);
                if (msg.author.presence.game)
                    infoEmbed.setDescription(msg.author.presence.game.name);
                infoEmbed.addField("ID", msg.author.id, true);
                infoEmbed.addField("Account Created", msg.author.createdAt, true);
                infoEmbed.addField("Joined Server", msg.member.joinedAt, true);
                if(msg.member.nickname)
                    infoEmbed.addField("Nickname", msg.member.nickname, true);
                infoEmbed.addField("Roles", rolesString, true);
                infoEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                infoEmbed.setTimestamp();
                msg.channel.send("", { embed: infoEmbed });
            } else if(regMention.exec(options[0]) != null) {
                user = msg.guild.members.get(options[0].replace(/[^\w\s]/gi, ''));
                var toAuthor = user.nickname != null ? user.nickname : user.user.username;
                var infoEmbed = new Discord.RichEmbed();
                userRoles = new Discord.Collection(Array.from(user.roles.entries()).sort((a, b) => b[1].position - a[1].position));

                let roles = userRoles.filter((el) => { if (el.name !== '@everyone' && el.managed === false)
                    return true; }).map((el) => { return el; });
                let rolesString = '*none*';
                if (roles.length > 0)
                    rolesString = roles.join(', ');
                infoEmbed.setAuthor("User Info", msg.author.avatarURL);
                infoEmbed.setColor(rhc());
                if (user.user.premium)
                    infoEmbed.setTitle("💲 " + user.user.username + "#" + user.user.discriminator);
                else if(user.user.bot)
                    infoEmbed.setTitle("🤖 " + user.user.username + "#" + user.user.discriminator);
                else
                    infoEmbed.setTitle(user.user.username + "#" + user.user.discriminator);
                if (user.user.presence.game)
                    infoEmbed.setDescription("Playing **" + user.user.presence.game.name + "**");
                infoEmbed.addField("ID", user.user.id, true);
                infoEmbed.addField("Account Created", user.user.createdAt, true);
                infoEmbed.setThumbnail(user.user.avatarURL);
                infoEmbed.addField("Joined Server", user.joinedAt, true);
                if(user.nickname)
                  infoEmbed.addField("Nickname", user.nickname, true);
                infoEmbed.addField("Roles", rolesString, true);
                infoEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                infoEmbed.setTimestamp();
                msg.channel.send("", { embed: infoEmbed });
            }
        }
    }
};
