import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Conversation } from "../../../../entity/Conversation";
import { User } from "../../../../entity/User";
import { GQLContext } from "../../../../utils/graphql-utils";
import { YUP_CONVERSATION_CRUD } from "../../../common/yupSchema";
import { isAuth } from "../../../middleware/isAuth";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { ConversationRepository } from "../../../repos/conversation_repository";
import { UserRepository } from "../../../repos/user_repository";
import { CreateConversationInput } from "./create_conversation";
import { Error as ErrorSchema } from "../../../common/error.schema";

@Resolver((of) => Conversation)
class CreateConversation {
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_CRUD))
	@Mutation(() => ErrorSchema!, { nullable: true })
	async createConversation(
		@Arg("data") { name }: CreateConversationInput,
		@Ctx() { session }: GQLContext
	) {
		const conversation = await this.conversationRepository.find({
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
		await this.userRepository.findConversationAndUpdate(
			user as User,
			conversation[0]
		);
		const createdConversation = await this.conversationRepository.create({
			name,
			owner: user,
		});
		await this.conversationRepository.findMembersAndUpdate(
			createdConversation,
			user as User
		);

		return null;
	}
}

export default CreateConversation;
