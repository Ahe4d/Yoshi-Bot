//node modules
var Discord = require("discord.js");
var rhc = require("random-hex-color");
var os = require("os");

//functions
function timeFormat(time) {
    let hours = Math.floor(time / (60 * 60)),
        minutes = Math.floor(time % (60 * 60) / 60),
        seconds = Math.floor(time % 60);

    return pad(hours) + "h " + pad(minutes) + "m " + pad(seconds) + "s";
}

function pad(s) {
    return (s < 10 ? "0" : "") + s;
}

//module
exports.module = {
  "stats": {
      help: "",
      description: "Returns stats about the selfbot & the system it is being run on.",
      process: function(client, msg, params){
          var infoEmbed = new Discord.RichEmbed();
          infoEmbed.setAuthor("Stats", client.user.avatarURL);
          infoEmbed.setColor(rhc());
          if (os.platform() == "darwin") {
            infoEmbed.addField("Operating System", os.platform() + " " + os.release() + " (macOS)");
          } else if (os.platform() == "win32") {
            infoEmbed.addField("Operating System", os.platform() + " " + os.release() + " (Windows)");
          }
          infoEmbed.addField("CPU & Architecture", os.cpus()[0].model + "\r\n" + os.cpus().length + " Core\r\n" + os.arch());
          infoEmbed.addField("Memory", "**Free: **" + Math.round(os.freemem()/1024/1024) + "MB\r\n**Total: **" + Math.round(os.totalmem()/1024/1024) + "MB", true);
          infoEmbed.addField("Uptime", "**System: **" + timeFormat(os.uptime()) + "\r\n**Selfbit: **" + timeFormat(process.uptime()), true);
          infoEmbed.setFooter(msg.author.username, msg.author.avatarURL);
          infoEmbed.setTimestamp();
          msg.channel.send("", { embed: infoEmbed});
      }
  }
};
