import { EntityRepository, Repository } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Room } from "../../entity/Room";
import { User } from "../../entity/User";

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
	async findMessageAndUpdate(room: Room, chatMessage: Chat) {
		if (room.messages) {
			room.messages.push(chatMessage);
		} else {
			const chats: Chat[] = [];
			chats.push(chatMessage);
			room.messages = chats;
		}
		return room.save();
	}

	async findMembersAndUpdate(room: Room, user: User) {
		console.log(room);
		if (room.members) {
			room.members.push(user);
		} else {
			const users: User[] = [];
			users.push(user);
			room.members = users;
		}
		return room.save();
	}
}
