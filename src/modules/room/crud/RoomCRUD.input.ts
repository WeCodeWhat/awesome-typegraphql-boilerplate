import { Field, InputType } from "type-graphql";

@InputType()
export class AddNewRoomInput {
	@Field()
	name: string;
}
