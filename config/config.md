# Configuration

The `config.json` defines several settings for the selfbot, such as the client token (for logging into the Discord API) and the selfbot prefix (for "talking" to the selfbot)

The structure for `config.json` is as follows:
```json
{
  "prefix": "prefix", //selfbot prefix, something like 'a!'
  "token": "clienttoken", //client token, can be grabbed in the desktop client by going into developer tools > application > local storage, obviously you shouldn't give this to anyone
}```

After you are finished making changes to the configuration, save the file as `config.json`.
