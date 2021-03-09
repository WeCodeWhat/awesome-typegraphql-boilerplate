import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import * as path from "path";
import { redisPubSub } from "../helper/redis";
import { customAuthChecker } from "./authChecker";
import { ResolveTime, LogAccess } from "../modules/middleware";

const genSchema = async (): Promise<GraphQLSchema> => {
	const modulePath = "../modules/**/*.resolver.ts";
	const schema = await buildSchema({
		resolvers: [path.join(__dirname, modulePath)],
		container: Container,
		pubSub: redisPubSub,
		authChecker: customAuthChecker,
		globalMiddlewares: [ResolveTime, LogAccess],
	});

	return schema;
};

export default genSchema;
