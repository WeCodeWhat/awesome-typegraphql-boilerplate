import { Arg, Resolver, Query, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { YUP_UUID } from "../../../shared/yupSchema";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { ConversationUnion } from "../../../shared/ConversationUnion.type";
import { DirectConversationRepository } from "../../../repository/conversation/DirectConversationRepository";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";

@Resolver((of) => Conversation)
class GetConversationResolver {
	@InjectRepository(ConversationRepository)
	private readonly directConversationRepository: DirectConversationRepository;

	@InjectRepository(ConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;

	@UseMiddleware(yupValidateMiddleware(YUP_UUID))
	@Query(() => ConversationUnion, { nullable: true })
	async getConversation(@Arg("id") id: String) {
		const directConversation = await this.directConversationRepository.findOne({
			relations: ["participants", "messages", "messages.sender"],
			where: {
				id,
			},
		});

		const groupConversation = await this.groupConversationRepository.findOne({
			relations: ["participants", "messages", "messages.sender"],
			where: {
				id,
			},
		});

		return directConversation || groupConversation;
	}
}

export default GetConversationResolver;
