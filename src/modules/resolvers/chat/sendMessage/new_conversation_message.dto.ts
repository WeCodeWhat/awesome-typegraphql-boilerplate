import { Field, InputType } from "type-graphql";

@InputType()
export class NewConversationMessageDto {
	@Field()
	conversationId: string;
}
