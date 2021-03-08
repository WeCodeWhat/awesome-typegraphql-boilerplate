import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { GQLContext } from "../../../../utils/graphql-utils";
import { YUP_CONVERSATION_CRUD } from "../../../common/yupSchema";
import { isAuth } from "../../../middleware/isAuth";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { UserRepository } from "../../../repository/user/UserRepository";
import { Error as ErrorSchema } from "../../../common/error.schema";
import { DirectConversationRepository } from "../../../repository/conversation/DirectConversationRepository";
import { CreateDirectConversationInput } from "./create_direct_conversation.dto";
import { ErrorMessage } from "../../../common/ErrorMessage";
import { User } from "../../../../entity/User";

@Resolver((of) => Conversation)
class CreateDirectConversation {
	@InjectRepository(DirectConversationRepository)
	private readonly directConversationRepository: DirectConversationRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_CRUD))
	@Mutation(() => ErrorSchema!, { nullable: true })
	async createGroupConversation(
		@Arg("data") { toId }: CreateDirectConversationInput,
		@Ctx() { session }: GQLContext
	) {
		const to = await this.userRepository.findOne({
			where: { id: toId },
		});

		if (!to) {
			return {
				path: "toId",
				message: ErrorMessage.userIsNotFound,
			};
		}

		const conversation = await this.directConversationRepository.find({
			where: {
				id: toId,
			},
		});
		if (conversation.length > 0) {
			return {
				path: "name",
				message: ErrorMessage.conversationHasBeenCreated,
			};
		}
		const user = await this.userRepository.findOne({
			where: { id: session.userId },
		});

		const createdConversation = await this.directConversationRepository.create();

		await this.userRepository.findUsersAndUpdateConversation(
			[user as User, to],
			createdConversation
		);

		await this.directConversationRepository.findConversationAndUpdateParticipants(
			createdConversation,
			[user as User, to]
		);

		return null;
	}
}

export default CreateDirectConversation;
