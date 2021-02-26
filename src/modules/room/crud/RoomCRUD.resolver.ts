import {
	Arg,
	Resolver,
	Mutation,
	Query,
	Ctx,
	UseMiddleware,
} from "type-graphql";
import { Error as ErrorSchema } from "../../common/error.schema";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Room } from "../../../entity/Room";
import { RoomRepository } from "../../repos/RoomRepo";
import { isAuth } from "../../middleware/isAuth";
import { GQLContext } from "../../../utils/graphql-utils";
import { UserRepository } from "../../repos/UserRepo";
import { AddNewRoomInput } from "./RoomCRUD.input";
import { YUP_ROOMCRUD, YUP_UUID } from "../../common/yupSchema";
import { yupValidateMiddleware } from "../../middleware/yupValidate";
import { User } from "../../../entity/User";

@Resolver((of) => Room)
class RoomCRUDResolver {
	@InjectRepository(RoomRepository)
	private readonly roomRepository: RoomRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@Query(() => [Room]!)
	async getRooms() {
		return await this.roomRepository.find({
			relations: ["members", "messages", "messages.sender"],
		});
	}

	@UseMiddleware(yupValidateMiddleware(YUP_UUID))
	@Query(() => Room, { nullable: true })
	async getRoom(@Arg("id") id: String) {
		return await this.roomRepository.findOne({
			relations: ["members", "messages", "messages.sender"],
			where: {
				id,
			},
		});
	}

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_ROOMCRUD))
	@Mutation(() => ErrorSchema!, { nullable: true })
	async addNewRoom(
		@Arg("data") { name }: AddNewRoomInput,
		@Ctx() { session }: GQLContext
	) {
		const room = await this.roomRepository.find({ where: { name } });
		if (room.length > 0) {
			return {
				path: "name",
				message: "This room has been created",
			};
		}
		const user = await this.userRepository.findOne({
			where: { id: session.userId },
		});
		await this.userRepository.findRoomAndUpdate(user as User, room[0]);
		const createdRoom = await this.roomRepository.create({
			name,
			owner: user,
		});
		await this.roomRepository.findMembersAndUpdate(createdRoom, user as User);

		return null;
	}
}

export default RoomCRUDResolver;



