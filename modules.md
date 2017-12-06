# selfbit - modules & commands

## Introduction
Modules, in terms of this selfbot, are another name for commands. They are placed in the `modules` folder.

## How it works
A module is defined in its own .js file in the `modules` folder. Inside defines basic module info such as description, help and the process (function).
![play.js & stats.js (modules)](https://i.imgur.com/uKSnGwP.png)





## Creating a module
To create a module, you must first create its .js file, then follow the structure below:

```js
//node modules; add variables if needed
var blah = require("blah");

//functions; create if needed
function blah {
  console.log("blah");
}

//module
exports.module = { //defining the module
  "modulename": { //name for the module
    description: "This is a module description", //description for the module
    help: "This is a module usage", //usage for the module
    process: function(client, msg, params) { //module functionality
      //code goes here
      msg.channel.send("This is a module process");
    }
  }
};```
>Modules must be named `module.js` and must follow the structure as shown above
