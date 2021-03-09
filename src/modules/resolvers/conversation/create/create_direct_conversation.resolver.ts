import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { GQLContext } from "../../../../utils/graphql-utils";
import { isAuth, yupValidateMiddleware } from "../../../middleware";
import { UserRepository } from "../../../repository/user/UserRepository";
import { ErrorMessage } from "../../../../shared/ErrorMessage.type";
import { DirectConversationRepository } from "../../../repository/conversation/DirectConversationRepository";
import {
	CreateDirectConversationDto,
	YUP_DIRECT_CONVERSATION_CREATE,
} from "./create_direct_conversation.dto";
import { User } from "../../../../entity/User";
import { DirectConversation } from "../../../../entity/DirectConversation";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";

@Resolver((of) => DirectConversation)
class CreateDirectConversation {
	@InjectRepository(DirectConversationRepository)
	private readonly directConversationRepository: DirectConversationRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_DIRECT_CONVERSATION_CREATE))
	@Mutation(() => ErrorMessage!, { nullable: true })
	async createDirectConversation(
		@Arg("data") { toId }: CreateDirectConversationDto,
		@Ctx() { session }: GQLContext
	) {
		const to = await this.userRepository.findOne({
			where: { id: toId },
		});

		if (!to) {
			return {
				path: "toId",
				message: ErrorMessage,
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
				message: CustomMessage.conversationHasBeenCreated,
			};
		}
		const user = await this.userRepository.findOne({
			where: { id: session.userId },
		});

		const createdConversation = await this.directConversationRepository.create();

		[user as User, to].forEach(async (u) => {
			await this.userRepository.findUserAndUpdateConversation(
				u,
				createdConversation
			);
			await this.directConversationRepository.findConversationAndUpdateParticipant(
				createdConversation,
				u
			);
		});

		await createdConversation.save();

		return null;
	}
}

export default CreateDirectConversation;
