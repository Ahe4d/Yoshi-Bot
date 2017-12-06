//node modules
var Discord = require("discord.js");

//module
exports.module = {
    "play": {
        help: "path/to/audio",
        description: "Will attempt to play audio from the specified file in the current voice channel.",
        process: function(client, msg, params, Discord, connection){
            if (!msg.guild) return;
            if(msg.member.voiceChannel) {
                msg.member.voiceChannel.join()
                .then(connection => {
                    if(params.endsWith(".mp3")) {
                        const dispatcher = connection.playFile('./' + params);
                        var playSuccessEmbed = new Discord.RichEmbed();
                        playSuccessEmbed.setAuthor("Music", msg.author.avatarURL);
                        playSuccessEmbed.setColor("#663366");
                        playSuccessEmbed.setDescription("Playing file `" + params + "`!");
                        playSuccessEmbed.setTimestamp();
                        playSuccessEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                        msg.channel.send("", { embed: playSuccessEmbed });

                        dispatcher.on('end', () => {
                            var playFinishedEmbed = new Discord.RichEmbed();
                            playFinishedEmbed.setAuthor("Music", msg.author.avatarURL);
                            playFinishedEmbed.setDescription("File `" + params + "` has finished playing!");
                            playFinishedEmbed.setTimestamp();
                            playFinishedEmbed.setColor("#663366");
                            playFinishedEmbed.setFooter(msg.author.username, msg.author.avatarURL);
                            msg.channel.send("", { embed: playFinishedEmbed })
                        });
                        dispatcher.on('error', e => {
                            // Catch any errors that may arise
                            msg.channel.send("Error, check console.");
                            console.log(e);
                        });
                    } else {
                        msg.channel.send("Invalid file!");
                    }
                })
                .catch(console.log);
          } else {
              msg.channel.send('You need to join a voice channel first!');
          }
      }
   }
};
