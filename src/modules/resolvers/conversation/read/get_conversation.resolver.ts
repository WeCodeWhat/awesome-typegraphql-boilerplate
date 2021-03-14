import { Arg, Resolver, Query, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { YUP_UUID } from "../../../../shared/yupSchema";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { ConversationUnion } from "../../../../shared/ConversationUnion.type";
import { DirectConversationRepository } from "../../../repository/conversation/DirectConversationRepository";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";
import {
	GetConversationDto,
	YUP_CONVERSATION_READ,
} from "./get_conversation.dto";

@Resolver((of) => Conversation)
class GetConversationResolver {
	@InjectRepository(ConversationRepository)
	private readonly directConversationRepository: DirectConversationRepository;

	@InjectRepository(ConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;

	@UseMiddleware(yupValidateMiddleware(YUP_CONVERSATION_READ))
	@Query(() => ConversationUnion, { nullable: true })
	async getConversation(@Arg("data") { conversationId }: GetConversationDto) {
		const directConversation = await this.directConversationRepository.findOne({
			relations: ["participants", "messages", "messages.sender"],
			where: {
				id: conversationId,
			},
		});

		const groupConversation = await this.groupConversationRepository.findOne({
			relations: ["participants", "messages", "messages.sender"],
			where: {
				id: conversationId,
			},
		});

		return directConversation || groupConversation;
	}
}

export default GetConversationResolver;
