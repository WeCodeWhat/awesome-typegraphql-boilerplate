import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { isAuth, yupValidateMiddleware } from "../../../middleware";
import { ErrorMessage } from "../../../../shared/ErrorMessage.type";
import {
	DeleteConversationDto,
	YUP_CONVERSATION_DELETE,
} from "./delete_conversation.dto";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";

@Resolver((of) => Conversation)
class DeleteConversation {
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository<any>;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_DELETE))
	@Mutation(() => ErrorMessage!, { nullable: true })
	async deleteConversation(
		@Arg("data") { conversationId }: DeleteConversationDto
	) {
		const conversation = await this.conversationRepository.findOne({
			where: {
				id: conversationId,
			},
		});
		if (!conversation) {
			return {
				path: conversationId,
				message: CustomMessage.conversationIsNotExist,
			};
		}

		await this.conversationRepository
			.createQueryBuilder()
			.delete()
			.from(Conversation)
			.where("id = :id", { id: conversationId })
			.execute();

		return null;
	}
}

export default DeleteConversation;
