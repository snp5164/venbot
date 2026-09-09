# Venbot (but slightly different)

Venbot is a Discord bot used on the [Vencord](https://vencord.dev) Discord server.

This bot is very specialised for the Vencord server and its community, ~~so it might not be very useful for other servers.~~ and this is a fork made to add features to the instance I run for my own server. Don't expectmany new features though.

Nevertheless it is still available under a free software license so you can easily audit and modify it!

## Setup

Prequisites: git, nodejs, pnpm

1. Clone the repository
2. Copy `assets/examples/config.example.ts` to `src/config.ts` and fill in all values. Many modules can be disabled via their `enabled` config value.
    If you disable a module, you don't need to fill in any other config values for it.

## Running

1. Run `pnpm install` to install dependencies
2. Run `pnpm start` to start the bot

## Running with pm2

Running the bot as a systemd service did not work for me when I first started using my own instance for some reason, and I have instead opted to use pm2 to start the bot after turning on the VPS it runs on. The restart command was changed to run the `pm2 restart` command instead of letting process.exit(0) and systemd do their thing.

Assuming you have pm2 installed on your system and `pm2 startup` is configured, the steps are:

1. `cd` into `/path/to/venbot`
2. Run `pm2 start pnpm --name venbot -- start`
3. Run `pm2 save`

## HTTP Server

The bot includes a HTTP server that is used for some modules (namely GitHub linking and the Vencord reporter). If you want to enable it,
you also have to set up a reverse proxy to forward traffic to the bot.

I suggest [Caddy](https://caddyserver.com/). You can find an example Caddyfile in `assets/examples/Caddyfile`. The Caddyfile and `config.ts` file
should have matching domains and port.
