import { Field, InputType } from "type-graphql";

@InputType()
export class CreateDirectConversationInput {
	@Field()
	toId: string;
}
