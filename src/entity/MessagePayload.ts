import { Field, ObjectType } from "type-graphql";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType("MessagePayloadSchema")
export class MessagePayload {
	@Field(() => String!)
	messageId: String;

	@Field(() => String!)
	conversationId: String;
}
