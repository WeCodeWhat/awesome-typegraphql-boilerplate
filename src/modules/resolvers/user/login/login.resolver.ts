import { Arg, Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { User } from "../../../../entity/User";
import { ErrorMessage } from "../../../../shared/ErrorMessage.type";
import { LoginDto } from "./login.dto";
import { UserRepository } from "../../../repository/user/UserRepository";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as bcrypt from "bcrypt";
import { GQLContext } from "../../../../utils/graphql-utils";
import { USER_SESSION_ID_PREFIX } from "../../../../constants/global-variables";
import { yupValidateMiddleware } from "../../../middleware/yupValidate";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { YUP_LOGIN } from "./login.validate";

@Resolver((of) => User)
class LoginResolver {
	@InjectRepository(UserRepository)
	private readonly userRepository: UserRepository;

	@UseMiddleware(yupValidateMiddleware(YUP_LOGIN))
	@Mutation(() => [ErrorMessage]!, { nullable: true })
	async login(
		@Arg("data") { email, password }: LoginDto,
		@Ctx() { request, session, redis }: GQLContext
	) {
		let errors: ErrorMessage[] = [];
		let user = await this.userRepository.findByEmail(email);

		if (!user) {
			errors.push({
				path: "email",
				message: CustomMessage.accountIsNotRegister,
			});
		}
		user = user as User;

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			errors.push({
				path: "password",
				message: CustomMessage.passwordIsNotMatch,
			});
		}

		if (!user.isVerified) {
			errors.push({
				path: "isVerified",
				message: CustomMessage.userIsNotVerified,
			});
		}

		if (user.isBanned) {
			errors.push({
				path: "isBanned",
				message: CustomMessage.userIsBanned,
			});
		}

		if (session.userId) {
			errors.push({
				path: "login",
				message: CustomMessage.userHasLoggedIn,
			});
		}

		if (errors.length !== 0) return errors;

		session.userId = user.id;

		if (request?.sessionID) {
			redis.lpush(`${USER_SESSION_ID_PREFIX}${user.id}`, user.id);
		}
		session.save();
		return null;
	}
}

export default LoginResolver;
