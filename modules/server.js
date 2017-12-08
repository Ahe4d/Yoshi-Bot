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
            const channels = msg.guild.channels.map(ty => ty.type),
                presences = msg.guild.presences.map(st => st.status)
            let guildChannels = 0,
                onlineMembers = 0;

            for (const i in presences) {
    			      if (presences[i] !== 'offline') {
    				        onlineMembers += 1;
    			      }
    		    }
		        for (const i in channels) {
			          if (channels[i] === 'text') {
				            guildChannels += 1;
			          }
		        }
            var serverEmbed = new Discord.RichEmbed();
            serverEmbed.setAuthor("Guild Info", msg.author.avatarURL);
            serverEmbed.setTitle(msg.guild.name);
            serverEmbed.setColor(rhc());
            serverEmbed.setDescription(msg.guild.memberCount + " members, " + onlineMembers + " online");
            serverEmbed.setThumbnail(msg.guild.iconURL);
            serverEmbed.addField("ID", msg.guild.id, true);
            serverEmbed.addField("Created On", msg.guild.createdAt, true);
            if(msg.guild.owner.user.premium)
                serverEmbed.addField("Owner", "💲 " + msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator, true);
            else
                serverEmbed.addField("Owner", msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator, true);
            serverEmbed.addField("Region", msg.guild.region, true);
            serverEmbed.addField("# of Emojis", msg.guild.emojis.size, true);
            serverEmbed.addField("# of Roles", msg.guild.roles.size, true);
            serverEmbed.addField("# of Channels", guildChannels, true);
            serverEmbed.setFooter(msg.author.username, msg.author.avatarURL);
            serverEmbed.setTimestamp();
            msg.channel.send("", { embed: serverEmbed });
        }
    }
};
