import { Field, InputType } from "type-graphql";
import { GroupConversationVisibility } from "../../../shared/ConversationVisibility.enum";

@InputType()
export class CreateGroupConversationDto {
	@Field()
	name: string;

	@Field(() => GroupConversationVisibility!)
	visibility: GroupConversationVisibility;
}
