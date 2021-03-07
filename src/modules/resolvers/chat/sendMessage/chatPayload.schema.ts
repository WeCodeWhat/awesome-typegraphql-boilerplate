import { Field, ObjectType } from "type-graphql";
import { Conversation } from "../../../../entity/Conversation";
import { User } from "../../../../entity/User";

@ObjectType("ChatPayload")
export class ChatPayload {
	@Field(() => String!)
	message: String;
	@Field(() => User!)
	sender: User;
	@Field(() => Conversation!)
	conversation: Conversation;
}
