import { Field, InputType } from "type-graphql";
import { GroupConversationVisibility } from "../../../../shared/ConversationVisibility.enum";
import * as yup from "yup";
@InputType()
export class CreateGroupConversationDto {
	@Field()
	name: string;

	@Field(() => GroupConversationVisibility!)
	visibility: GroupConversationVisibility;
}

export const YUP_GROUP_CONVERSATION_CREATE = yup.object().shape({
	name: yup.string().min(1).max(30),
});
