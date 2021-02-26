import { Field, InputType } from "type-graphql";

@InputType()
export class SendMessageInput {
	@Field()
	roomId: string;

	@Field()
	message: string;
}
