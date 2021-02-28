import { Field, InputType } from "type-graphql";

@InputType()
export class NewConversationMessageInput {
	@Field()
	conversationId: string;
}
