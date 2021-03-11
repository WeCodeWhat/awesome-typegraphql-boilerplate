import { Field, InputType } from "type-graphql";
import * as yup from "yup";
@InputType()
export class DeleteConversationDto {
	@Field()
	conversationId: string;
}

export const YUP_CONVERSATION_DELETE = yup.object().shape({
	conversationId: yup.string().uuid(),
});
