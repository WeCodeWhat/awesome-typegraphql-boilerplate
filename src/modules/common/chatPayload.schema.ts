import { Field, ObjectType } from "type-graphql";
import { Room } from "../../entity/Room";
import { User } from "../../entity/User";

@ObjectType("ChatPayload")
export class ChatPayload {
	@Field(() => String!)
	message: String;
	@Field(() => User!)
	sender: User;
	@Field(() => Room!)
	room: Room;
}
