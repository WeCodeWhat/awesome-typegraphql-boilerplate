import { EntityRepository, Repository } from "typeorm";
import { Conversation } from "../../../entity/Conversation";
import { User } from "../../../entity/User";
import { ErrorMessage } from "../../common/ErrorMessage";

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
	async findConversationAndUpdate(user: User, conversation: Conversation) {
		console.log(conversation);
		if (user?.conversations) {
			user?.conversations.push(conversation);
		} else {
			const conversations: Conversation[] = [];
			conversations.push(conversation);
			user.conversations = conversations;
		}
		return user.save();
	}
}
