import { defineCommand } from "~/Commands";
import { BotState } from "~/db/botState";
import { backupStickyStates } from "~/modules/sticky";
import { execFileP } from "~/util/childProcess";
import { silently } from "~/util/functions";

export async function restart(channelId: string, messageId: string) {
    BotState.restartData = {
        channelId,
        messageId,
        stickyStates: backupStickyStates()
    };

    // systemd will restart us
    // process.exit(0);

    // NOPE execfile saves us to trigger pm2 restart since process.exit doesnt for some reason even though it should
    await silently(execFileP("pm2", ["restart", process.env.pm_id]));
}

defineCommand({
    name: "restart",
    description: "Restart the bot",
    usage: null,
    ownerOnly: true,
    async execute({ reply }) {
        const m = await reply("Restarting...");
        await restart(m.channelID, m.id);
    }
});
