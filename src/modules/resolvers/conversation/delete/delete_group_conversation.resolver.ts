import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { isAuth, yupValidateMiddleware } from "../../../middleware";
import { ErrorMessage } from "../../../../shared/ErrorMessage.type";
import {
	DeleteConversationDto,
	YUP_CONVERSATION_DELETE,
} from "./delete_conversation.dto";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";
import { GroupConversation } from "../../../../entity/GroupConversation";
import { GQLContext } from "../../../../utils/graphql-utils";

@Resolver((of) => GroupConversation)
class DeleteGroupConversation {
	@InjectRepository(GroupConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_DELETE))
	@Mutation(() => ErrorMessage!, { nullable: true })
	async deleteGroupConversation(
		@Arg("data") { conversationId }: DeleteConversationDto,
		@Ctx() { session }: GQLContext
	) {
		const conversation = await this.groupConversationRepository.findOne({
			where: {
				id: conversationId,
			},
			relations: ["owner"],
		});

		if (!conversation) {
			return {
				path: "conversationId",
				message: CustomMessage.conversationIsNotExist,
			};
		}

		if (conversation.owner.id !== session.userId) {
			return {
				path: "userId",
				message: CustomMessage.userIsNotOwner,
			};
		}

		await this.groupConversationRepository
			.createQueryBuilder()
			.delete()
			.from(GroupConversation)
			.where("id = :id", { id: conversationId })
			.execute();

		return null;
	}
}

export default DeleteGroupConversation;
