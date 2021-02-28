import { EntityRepository, Repository } from "typeorm";
import { Message } from "../../entity/Message";
import { Conversation } from "../../entity/Conversation";
import { User } from "../../entity/User";

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {
	async findMessageAndUpdate(conversation: Conversation, chatMessage: Message) {
		if (conversation.messages) {
			conversation.messages.push(chatMessage);
		} else {
			const chats: Message[] = [];
			chats.push(chatMessage);
			conversation.messages = chats;
		}
		return conversation.save();
	}

	async findMembersAndUpdate(conversation: Conversation, user: User) {
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
