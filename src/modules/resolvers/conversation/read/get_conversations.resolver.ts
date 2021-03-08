import { Resolver, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { GroupConversation } from "../../../../entity/GroupConversation";
import { ConversationUnion } from "../../../common/global.type";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { DirectConversationRepository } from "../../../repository/conversation/DirectConversationRepository";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";

@Resolver((of) => Conversation)
class GetConversationsResolvers {
	@InjectRepository(ConversationRepository)
	private readonly directConversationRepository: DirectConversationRepository;
	@InjectRepository(GroupConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;

	@Query(() => [ConversationUnion]!)
	async getConversations() {
		const groupConversations = await this.groupConversationRepository.find({
			relations: ["participants", "messages", "messages.sender"],
		});

		const directConversations = await this.directConversationRepository.find({
			relations: ["participants", "messages", "messages.sender"],
		});

		return [...groupConversations, ...directConversations];
	}
}

export default GetConversationsResolvers;
