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
import { ChatRepository } from "../../repos/ChatRepo";
import { InjectRepository } from "typeorm-typedi-extensions";
import { SendMessageInput } from "./SendMessage.input";
import { RoomRepository } from "../../repos/RoomRepo";
import { Error as ErrorSchema } from "../../common/error.schema";
import { ErrorMessage } from "../../common/ErrorMessage";
import { ChatPayload } from "../../common/chatPayload.schema";
import { Chat } from "../../../entity/Chat";
import { isAuth } from "../../middleware/isAuth";
import { GQLContext } from "../../../utils/graphql-utils";
import { UserRepository } from "../../repos/UserRepo";
import { NewRoomMessageInput } from "./NewRoomMessage.input";

enum SubTopic {
	NEW_ROOM_MESSAGE_ADDED = "NEW_ROOM_MESSAGE_ADDED",
}

@Resolver((of) => Chat)
class SendMessageResolver {
	@InjectRepository(ChatRepository)
	private readonly chatRepository: ChatRepository;
	@InjectRepository(RoomRepository)
	private readonly roomRepository: RoomRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@Subscription({
		topics: SubTopic.NEW_ROOM_MESSAGE_ADDED,
		filter: ({
			payload,
			args,
		}: {
			payload: ChatPayload;
			args: { data: NewRoomMessageInput };
		}) => args.data.roomId === payload.room.id,
		nullable: true,
	})
	newRoomMessageAdded(
		@Root() chatPayload: ChatPayload,
		@Arg("data") args: NewRoomMessageInput
	): ChatPayload {
		return {
			...chatPayload,
		};
	}

	@UseMiddleware(isAuth)
	@Mutation(() => ErrorSchema!, { nullable: true })
	async sendMessage(
		@Arg("data") { message, roomId }: SendMessageInput,
		@PubSub(SubTopic.NEW_ROOM_MESSAGE_ADDED) publish: Publisher<ChatPayload>,
		@Ctx() { session }: GQLContext
	) {
		const room = await this.roomRepository.findOne({
			where: { id: roomId },
			relations: ["messages"],
		});
		if (!room) {
			return {
				path: "roomId",
				message: ErrorMessage.roomIdIsNotValid,
			};
		}
		const users = await this.userRepository.find({
			where: { id: session.userId },
		});
		const chatMessage = await this.chatRepository
			.create({ message, sender: users[0], room })
			.save();
		await this.roomRepository.findMessageAndUpdate(room, chatMessage);
		await publish({
			message: chatMessage.message,
			room: chatMessage.room,
			sender: chatMessage.sender,
		}).catch((err) => console.log(err));
		return null;
	}
}

export default SendMessageResolver;
