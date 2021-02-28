import { Field, InputType } from "type-graphql";

@InputType()
export class SendMessageInput {
	@Field()
	conversationId: string;

	@Field()
	message: string;
}
