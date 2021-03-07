import { Resolver, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationUnion } from "../../../common/global.type";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";

@Resolver((of) => Conversation)
class GetConversationsResolvers {
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository;
	@InjectRepository(GroupConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;

	@Query(() => [ConversationUnion]!)
	async getConversations() {
		return await this.groupConversationRepository.find({
			relations: ["participants", "messages", "messages.sender"],
		});
	}
}

export default GetConversationsResolvers;
