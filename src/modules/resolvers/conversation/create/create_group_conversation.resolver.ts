import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../../../entity/User";
import { GQLContext } from "../../../../utils/graphql-utils";
import { YUP_CONVERSATION_CRUD } from "../../../shared/yupSchema";
import { isAuth } from "../../../middleware/isAuth";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { GroupConversationRepository } from "../../../repository/conversation/GroupConversationRepository";
import { UserRepository } from "../../../repository/user/UserRepository";
import { CreateGroupConversationDto } from "./create_group_conversation.dto";
import { ErrorMessage } from "../../../shared/ErrorMessage.type";
import { GroupConversation } from "../../../../entity/GroupConversation";

@Resolver((of) => GroupConversation)
class CreateGroupConversation {
	@InjectRepository(GroupConversationRepository)
	private readonly groupConversationRepository: GroupConversationRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_CRUD))
	@Mutation(() => ErrorMessage!, { nullable: true })
	async createGroupConversation(
		@Arg("data") { name, visibility }: CreateGroupConversationDto,
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

		console.log(createdConversation);

		await this.userRepository.findUserAndUpdateConversation(
			user as User,
			createdConversation
		);

		await this.groupConversationRepository.findConversationAndUpdateParticipant(
			createdConversation,
			user as User
		);

		await createdConversation.save();

		return null;
	}
}

export default CreateGroupConversation;
