import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import * as path from "path";
import { redisPubSub } from "../helper/redis";
import { customAuthChecker } from "./authChecker";
import { ResolveTime } from "../modules/middleware";
import * as User from "../modules/resolvers/user";

const genSchema = async (): Promise<GraphQLSchema> => {
	// const modulePath = "../modules/**/*.resolver.{ts,js}";
	// path.join(__dirname + modulePath)
	const schema = await buildSchema({
		resolvers: [
			User.GetUserResolver,
			User.GetUsersResolver,
			User.LoginResolver,
			User.MeResolver,
			User.RegisterResolver,
		],
		container: Container,
		pubSub: redisPubSub,
		authChecker: customAuthChecker,
		globalMiddlewares: [ResolveTime],
	});

	return schema;
};

export default genSchema;
