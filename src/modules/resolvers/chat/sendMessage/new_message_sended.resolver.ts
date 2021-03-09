import { Arg, Resolver, Root, Subscription } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Message } from "../../../../entity/Message";
import { MessagePayload } from "../../../../entity/MessagePayload";
import { SubTopic } from "../../../../shared/SubTopic.enum";
import { ChatRepository } from "../../../repository/chat/ChatRepository";
import { NewMessageSendedDto } from "./new_message_sended.dto";

@Resolver((type) => Message)
class NewMessageSended {
	@InjectRepository(ChatRepository)
	private readonly chatRepository: ChatRepository;

	@Subscription(() => Message, {
		topics: SubTopic.NEW_CONVERSATION_MESSAGE_ADDED,
		filter: ({
			payload,
			args,
		}: {
			payload: MessagePayload;
			args: { data: NewMessageSendedDto };
		}) => args.data.conversationId === payload.conversationId,
		nullable: true,
	})
	async newMessageSended(
		@Root() messagePayload: MessagePayload,
		@Arg("data") args: NewMessageSendedDto
	): Promise<Message | undefined> {
		return await this.chatRepository.findOne({
			id: messagePayload.messageId,
		});
	}
}

export default NewMessageSended;
