import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { User } from "../../../../entity/User";
import { GQLContext } from "../../../../utils/graphql-utils";
import { YUP_CONVERSATION_CRUD } from "../../../common/yupSchema";
import { isAuth } from "../../../middleware/isAuth";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";
import { UserRepository } from "../../../repository/user/UserRepository";
import { CreateGroupConversationInput } from "./create_group_conversation.input";
import { Error as ErrorSchema } from "../../../common/error.schema";

@Resolver((of) => Conversation)
class CreateGroupConversation {
	@InjectRepository(GroupConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_CRUD))
	@Mutation(() => ErrorSchema!, { nullable: true })
	async createGroupConversation(
		@Arg("data") { name, visibility }: CreateGroupConversationInput,
		@Ctx() { session }: GQLContext
	) {
		const conversation = await this.groupConversationRepository.find({
			where: { name },
		});
		if (conversation.length > 0) {
			return {
				path: "name",
				message: "This conversation has been created",
			};
		}
		const user = await this.userRepository.findOne({
			where: { id: session.userId },
		});
		const createdConversation = await this.groupConversationRepository.create({
			name,
			visibility,
			owner: user,
		});

		await this.userRepository.findConversationAndUpdate(
			user as User,
			createdConversation
		);

		await this.groupConversationRepository.findParticipantsAndUpdate(
			createdConversation,
			user as User
		);

		return null;
	}
}

export default CreateGroupConversation;
