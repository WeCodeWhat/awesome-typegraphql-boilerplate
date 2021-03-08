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
import { SendMessageInput } from "./send_message.dto";
import { ConversationRepository } from "../../../repository/conversation/ConversationRepository";
import { Error as ErrorSchema } from "../../../common/error.schema";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { ChatPayload } from "./chatPayload.schema";
import { Message } from "../../../../entity/Message";
import { isAuth } from "../../../middleware/isAuth";
import { GQLContext } from "../../../../utils/graphql-utils";
import { UserRepository } from "../../../repository/user/UserRepository";
import { NewConversationMessageInput } from "./new_conversation_message.dto";

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
			payload: ChatPayload;
			args: { data: NewConversationMessageInput };
		}) => args.data.conversationId === payload.conversation.id,
		nullable: true,
	})
	newConversationMessageAdded(
		@Root() chatPayload: ChatPayload,
		@Arg("data") args: NewConversationMessageInput
	): ChatPayload {
		return {
			...chatPayload,
		};
	}

	@UseMiddleware(isAuth)
	@Mutation(() => ErrorSchema!, { nullable: true })
	async sendMessage(
		@Arg("data") { message, conversationId }: SendMessageInput,
		@PubSub(SubTopic.NEW_CONVERSATION_MESSAGE_ADDED)
		publish: Publisher<ChatPayload>,
		@Ctx() { session }: GQLContext
	) {
		const conversation = await this.conversationRepository.findOne({
			where: { id: conversationId },
			relations: ["messages"],
		});
		if (!conversation) {
			return {
				path: "conversationId",
				message: ErrorMessage.conversationIdIsNotValid,
			};
		}
		const users = await this.userRepository.find({
			where: { id: session.userId },
		});
		const chatMessage = await this.chatRepository
			.create({ message, sender: users[0], conversation })
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
