import { Arg, Resolver, Query, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { YUP_UUID } from "../../../common/yupSchema";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";

@Resolver((of) => Conversation)
class ConversationCRUDResolver {
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository;

	@UseMiddleware(yupValidateMiddleware(YUP_UUID))
	@Query(() => Conversation, { nullable: true })
	async getConversation(@Arg("id") id: String) {
		return await this.conversationRepository.findOne({
			relations: ["participants", "messages", "messages.sender"],
			where: {
				id,
			},
		});
	}
}

export default ConversationCRUDResolver;
