import { Field, InputType } from "type-graphql";

@InputType()
export class CreateConversationInput {
	@Field()
	name: string;
}
