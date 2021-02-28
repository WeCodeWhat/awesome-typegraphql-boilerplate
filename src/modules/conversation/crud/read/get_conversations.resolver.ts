import { Resolver, Query } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";

@Resolver((of) => Conversation)
class ConversationCRUDResolver {
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository;

	@Query(() => [Conversation]!)
	async getConversations() {
		return await this.conversationRepository.find({
			relations: ["participants", "messages", "messages.sender"],
		});
	}
}

export default ConversationCRUDResolver;
