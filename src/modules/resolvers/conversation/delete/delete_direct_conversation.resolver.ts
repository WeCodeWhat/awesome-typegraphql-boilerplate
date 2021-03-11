import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { isAuth, yupValidateMiddleware } from "../../../middleware";
import { ErrorMessage } from "../../../../shared/ErrorMessage.type";
import {
	DeleteConversationDto,
	YUP_CONVERSATION_DELETE,
} from "./delete_conversation.dto";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { DirectConversationRepository } from "../../../repository/conversation/DirectConversationRepository";
import { DirectConversation } from "../../../../entity/DirectConversation";

@Resolver((of) => DirectConversation)
class DeleteDirectConversation {
	@InjectRepository(DirectConversationRepository)
	private readonly directConversationRepository: DirectConversationRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_DELETE))
	@Mutation(() => ErrorMessage!, { nullable: true })
	async deleteDirectConversation(
		@Arg("data") { conversationId }: DeleteConversationDto
	) {
		const conversation = await this.directConversationRepository.findOne({
			where: {
				id: conversationId,
			},
		});

		if (!conversation) {
			return {
				path: "conversationId",
				message: CustomMessage.conversationIsNotExist,
			};
		}

		await this.directConversationRepository
			.createQueryBuilder()
			.delete()
			.from(DirectConversation)
			.where("id = :id", { id: conversationId })
			.execute();

		return null;
	}
}

export default DeleteDirectConversation;
