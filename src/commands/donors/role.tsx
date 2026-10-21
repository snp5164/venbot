import { registerChatInputCommand } from "~/SlashCommands";

import Config from "~/config";
import { CommandAttachmentOption, CommandStringOption, CommandUserOption } from "~components";
import { PROD } from "../../constants";
import { fetchBuffer } from "../../util/fetch";

const Name = PROD ? "role-add" : "devrole-add";
const description = "add a custom role for a user";

registerChatInputCommand(
    {
        name: Name,
        description,
        defaultMemberPermissions: "0",
        options: <>
            <CommandUserOption name="user" required />
            <CommandStringOption name="name" required />
            <CommandStringOption name="color" />
            <CommandStringOption name="icon-url" />
            <CommandAttachmentOption name="icon" />
        </>
    },
    {
        guildOnly: true,
        async handle(i) {
            await i.defer();

            const opts = i.data.options;
            const user = opts.getUser("user", true);
            const name = opts.getString("name", true);
            const color = opts.getString("color")?.replace(/#/, "") || "000000";
            const iconUrl = opts.getAttachment("icon")?.url || opts.getString("icon-url");

            const iconBuf = !iconUrl
                ? undefined
                : await fetchBuffer(iconUrl);

            const role = await i.guild.createRole({
                name,
                colors: {
                    primaryColor: parseInt(color, 16),
                },
                icon: iconBuf,
                hoist: false,
                mentionable: false,
                reason: `Custom Role for ${user.tag}`,
                permissions: "0"
            });

            await i.guild.editRolePositions([{
                id: role.id,
                position: i.guild.roles.get(Config.roles.donor)!.position + 1
            }]);

            await i.guild.addMemberRole(user.id, role.id, "Custom Role");

            await i.createFollowup({
                content: "Created role <@&" + role.id + "> for <@" + user.id + ">!",
            });
        }
    }
);
