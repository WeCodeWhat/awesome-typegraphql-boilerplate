import { Repository } from "typeorm";
import { Conversation } from "../../../entity/Conversation";
import { Message } from "../../../entity/Message";
import { User } from "../../../entity/User";

export abstract class IConversationRepository<T> extends Repository<T> {
	async findMessageAndUpdate(conversation: Conversation, chatMessage: Message) {
		console.log("findMessageAndUpdate");
		if (conversation.messages) {
			conversation.messages.push(chatMessage);
		} else {
			const chats: Message[] = [];
			chats.push(chatMessage);
			conversation.messages = chats;
		}
		return conversation.save();
	}

	async findParticipantsAndUpdate(conversation: Conversation, user: User) {
		console.log("findParticipantsAndUpdate");
		if (conversation.participants) {
			conversation.participants.push(user);
		} else {
			const users: User[] = [];
			users.push(user);
			conversation.participants = users;
		}
		return conversation.save();
	}
}
