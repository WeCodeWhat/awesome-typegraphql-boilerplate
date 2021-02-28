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
import { Conversation } from "../../../entity/Conversation";
import { ConversationRepository } from "../../repos/ConversationRepo";
import { isAuth } from "../../middleware/isAuth";
import { GQLContext } from "../../../utils/graphql-utils";
import { UserRepository } from "../../repos/UserRepo";
import { AddNewConversationInput } from "./ConversationCRUD.input";
import { YUP_CONVERSATION_CRUD, YUP_UUID } from "../../common/yupSchema";
import { yupValidateMiddleware } from "../../middleware/yupValidate";
import { User } from "../../../entity/User";

@Resolver((of) => Conversation)
class ConversationCRUDResolver {
	@InjectRepository(ConversationRepository)
	private readonly conversationRepository: ConversationRepository;
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@Query(() => [Conversation]!)
	async getConversations() {
		return await this.conversationRepository.find({
			relations: ["participants", "messages", "messages.sender"],
		});
	}

	@UseMiddleware(yupValidateMiddleware(YUP_UUID))
	@Query(() => Conversation, { nullable: true })
	async getConversation(@Arg("id") id: String) {
		return await this.conversationRepository.findOne({
			relations: ["participants", "messages", "messages.sender"],
			where: {
				id,
			},
		});
	}

	@UseMiddleware(isAuth, yupValidateMiddleware(YUP_CONVERSATION_CRUD))
	@Mutation(() => ErrorSchema!, { nullable: true })
	async addNewConversation(
		@Arg("data") { name }: AddNewConversationInput,
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

export default ConversationCRUDResolver;
