import { Field, InputType } from "type-graphql";
import { GroupConversationVisibility } from "../../../../shared/ConversationVisibility";

@InputType()
export class CreateGroupConversationInput {
	@Field()
	name: string;

	@Field(() => GroupConversationVisibility!)
	visibility: GroupConversationVisibility;
}
