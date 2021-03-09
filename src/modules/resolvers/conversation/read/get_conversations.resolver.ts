import { Resolver, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationUnion } from "../../../../shared/ConversationUnion.type";
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
			relations: ["participants", "messages", "messages.sender", "owner"],
		});

		const directConversations = await this.directConversationRepository.find({
			relations: ["participants", "messages", "messages.sender"],
		});

		console.log(groupConversations);

		console.log(directConversations);

		return [...directConversations, ...groupConversations];
	}
}

export default GetConversationsResolvers;
