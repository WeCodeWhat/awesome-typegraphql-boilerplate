import {
	Arg,
	Resolver,
	Mutation,
	PubSub,
	UseMiddleware,
	Ctx,
	Publisher,
} from "type-graphql";
import { ChatRepository } from "../../../repository/chat/ChatRepository";
import { InjectRepository } from "typeorm-typedi-extensions";
import { SendMessageDto } from "./send_message.dto";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { ErrorMessage } from "../../../../shared/ErrorMessage.type";
import { MessagePayload } from "../../../../entity/MessagePayload";
import { Message } from "../../../../entity/Message";
import { isAuth } from "../../../middleware/isAuth";
import { GQLContext } from "../../../../utils/graphql-utils";
import { UserRepository } from "../../../repository/user/UserRepository";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { SubTopic } from "../../../../shared/SubTopic.enum";

@Resolver((of) => Message)
class SendMessageResolver {
	@InjectRepository(ChatRepository)
	private readonly chatRepository: ChatRepository;
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository<any>;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(isAuth)
	@Mutation(() => ErrorMessage!, { nullable: true })
	async sendMessage(
		@Arg("data") { message, conversationId }: SendMessageDto,
		@PubSub(SubTopic.NEW_CONVERSATION_MESSAGE_ADDED)
		publish: Publisher<MessagePayload>,
		@Ctx() { session }: GQLContext
	) {
		const conversation = await this.conversationRepository.findOne({
			where: { id: conversationId },
			relations: ["messages"],
		});
		if (!conversation) {
			return {
				path: "conversationId",
				message: CustomMessage.conversationIdIsNotValid,
			};
		}
		const user = await this.userRepository.findOne({
			where: { id: session.userId },
		});
		const chatMessage = await this.chatRepository
			.create({ message, sender: user, conversation })
			.save();

		await this.conversationRepository.findConversationAndUpdateMessage(
			conversation,
			chatMessage
		);
		await publish({
			conversationId: chatMessage.conversation.id,
			messageId: chatMessage.id,
		}).catch((err) => {
			throw new Error(err);
		});
		return null;
	}
}

export default SendMessageResolver;
