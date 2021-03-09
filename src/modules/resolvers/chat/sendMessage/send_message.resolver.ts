import {
	Arg,
	Resolver,
	Mutation,
	PubSub,
	Subscription,
	Root,
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
import { NewConversationMessageDto } from "./new_conversation_message.dto";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";

enum SubTopic {
	NEW_CONVERSATION_MESSAGE_ADDED = "NEW_CONVERSATION_MESSAGE_ADDED",
}

@Resolver((of) => Message)
class SendMessageResolver {
	@InjectRepository(ChatRepository)
	private readonly chatRepository: ChatRepository;
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository<any>;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@Subscription({
		topics: SubTopic.NEW_CONVERSATION_MESSAGE_ADDED,
		filter: ({
			payload,
			args,
		}: {
			payload: MessagePayload;
			args: { data: NewConversationMessageDto };
		}) => args.data.conversationId === payload.conversation.id,
		nullable: true,
	})
	newConversationMessageAdded(
		@Root() messagePayload: MessagePayload,
		@Arg("data") args: NewConversationMessageDto
	): MessagePayload {
		console.log(args, messagePayload);
		return {
			...messagePayload,
		};
	}

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
		await publish(chatMessage).catch((err) => console.log(err));
		return null;
	}
}

export default SendMessageResolver;
