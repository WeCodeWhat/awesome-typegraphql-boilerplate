import { createUnionType } from "type-graphql";
import { Conversation } from "../../entity/Conversation";
import { GroupConversation } from "../../entity/GroupConversation";

export const ConversationUnion = createUnionType({
	name: "ConversationUnion",
	types: () => [GroupConversation, Conversation] as const,
	resolveType: (value) => {
		if ("owner" in value) {
			return GroupConversation;
		}
		return Conversation;
	},
});
