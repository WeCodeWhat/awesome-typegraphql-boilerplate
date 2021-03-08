import { Repository } from "typeorm";
import { Conversation } from "../../../entity/Conversation";
import { Message } from "../../../entity/Message";
import { User } from "../../../entity/User";

export class ConversationRepository<T> extends Repository<T> {
	async findConversationAndUpdateMessages(
		conversation: Conversation,
		chatMessages: Message[]
	) {
		chatMessages.forEach((msg) => {
			if (conversation.messages) {
				conversation.messages.push(msg);
			} else {
				const chats: Message[] = [];
				chats.push(msg);
				conversation.messages = chats;
			}
		});
	}

	async findConversationAndUpdateMessage(
		conversation: Conversation,
		chatMessage: Message
	) {
		if (conversation.messages) {
			conversation.messages.push(chatMessage);
		} else {
			const chats: Message[] = [];
			chats.push(chatMessage);
			conversation.messages = chats;
		}
	}

	async findConversationAndUpdateParticipants(
		conversation: Conversation,
		users: User[]
	) {
		users.forEach((user) => {
			if (conversation.participants) {
				conversation.participants.push(user);
			} else {
				const users: User[] = [];
				users.push(user);
				conversation.participants = users;
			}
		});
	}
}
