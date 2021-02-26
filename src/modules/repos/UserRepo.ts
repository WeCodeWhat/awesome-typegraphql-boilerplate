import { EntityRepository, Repository } from "typeorm";
import { Room } from "../../entity/Room";
import { User } from "../../entity/User";
import { ErrorMessage } from "../common/ErrorMessage";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async findByEmail(email: string | undefined) {
		return await this.findOne({ where: { email } });
	}
	async findByEmailOrCreate({
		email,
		firstName,
		lastName,
		password,
	}: Partial<User>) {
		const user = await this.findByEmail(email);
		if (!!user) {
			return {
				path: "email",
				message: ErrorMessage.emailIsRegister,
			};
		}
		await this.create({
			email,
			password,
			firstName,
			lastName,
		})
			.save()
			.then((err) => console.log(err));

		return null;
	}
	async findRoomAndUpdate(user: User, room: Room) {
		if (user?.room) {
			user?.room.push(room);
		} else {
			const rooms: Room[] = [];
			rooms.push(room);
			user.room = rooms;
		}

		return user.save();
	}
}
