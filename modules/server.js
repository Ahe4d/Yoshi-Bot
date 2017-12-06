//node modules
var Discord = require("discord.js");
var rhc = require("random-hex-color");

//module
exports.module = {
    "server": {
        help: "",
        description: "Gives information about the current guild.",
        process: function(client, msg, params){
            let serverRoles;
            serverRoles = new Discord.Collection(Array.from(msg.guild.roles.entries()).sort((a, b) => b[1].position - a[1].position));
            let roles = serverRoles.filter((el) => { if (el.name !== '@everyone' && el.managed === false)
                return true; }).map((el) => { return el; });
            let rolesString = '*none*';
            if (roles.length > 0)
            rolesString = roles.join(', ');
            var serverEmbed = new Discord.RichEmbed();
            serverEmbed.setAuthor("Guild Info", msg.author.avatarURL);
            serverEmbed.setTitle(msg.guild.name);
            serverEmbed.setColor(rhc());
            serverEmbed.setDescription(msg.guild.memberCount + " members");
            serverEmbed.setThumbnail(msg.guild.iconURL);
            serverEmbed.addField("ID", msg.guild.id);
            serverEmbed.addField("Created On", msg.guild.createdAt);
            if(msg.guild.owner.user.premium)
                serverEmbed.addField("Owner", "💲 " + msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator);
            else
                serverEmbed.addField("Owner", msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator);
            serverEmbed.addField("Region", msg.guild.region);
            //serverEmbed.addField("Emojis", msg.guild.emojis.array().join(", ")); disabled because of rich embed field character limit
            //serverEmbed.addField("Roles", rolesString); disabled because of rich embed field character limit
            serverEmbed.setFooter(msg.author.username, msg.author.avatarURL);
            serverEmbed.setTimestamp();
            msg.channel.send("", { embed: serverEmbed });
        }
    }
};
