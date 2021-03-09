import { Field, ObjectType } from "type-graphql";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType("MessagePayloadSchema")
export class MessagePayload {
	@Field(() => String!)
	message: String;
	@Field(() => User!)
	sender: User;
	@Field(() => Conversation!)
	conversation: Conversation;
}
