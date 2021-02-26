import { Field, InputType } from "type-graphql";

@InputType()
export class NewRoomMessageInput {
	@Field()
	roomId: string;
}
