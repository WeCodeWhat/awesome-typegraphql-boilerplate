import { Field, InputType } from "type-graphql";

@InputType()
export class CreateDirectConversationDto {
	@Field()
	toId: string;
}
