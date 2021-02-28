import { Field, InputType } from "type-graphql";

@InputType()
export class AddNewConversationInput {
	@Field()
	name: string;
}
