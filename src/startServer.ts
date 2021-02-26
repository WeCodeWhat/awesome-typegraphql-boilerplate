import "reflect-metadata";
import "dotenv/config";
import { createConnection, getConnectionOptions } from "typeorm";
import { GraphQLServer } from "graphql-yoga";
import genSchema from "./utils/genSchema";
import { sessionConfiguration } from "./helper/session";
import { REDIS } from "./helper/redis";
import { DEV_BASE_URL } from "./constants/global-variables";
import { env, EnvironmentType } from "./utils/environmentType";
import { formatValidationError } from "./utils/formatValidationError";
import { GQLContext } from "./utils/graphql-utils";
import { ContextParameters } from "graphql-yoga/dist/types";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const startServer = async () => {
	if (!env(EnvironmentType.PROD)) {
		await new REDIS().server.flushall();
	}
	const connectionOptions = await getConnectionOptions("default");
	const extendedOptions = {
		...connectionOptions,
		database: (connectionOptions.database +
			(env(EnvironmentType.TEST) ? "-testing" : "")) as any,
		dropSchema: env(EnvironmentType.TEST),
		namingStrategy: new SnakeNamingStrategy(),
	};
	if (process.env.DATABASE_URL && env(EnvironmentType.PROD)) {
		Object.assign(extendedOptions, {
			url: process.env.DATABASE_URL,
			ssl: env(EnvironmentType.PROD) ? { rejectUnauthorized: false } : false,
		});
	}
	const conn = await createConnection(extendedOptions);

	const server = new GraphQLServer({
		schema: await genSchema(),
		context: ({ request }: ContextParameters): Partial<GQLContext> => ({
			request,
			redis: new REDIS().server,
			session: request?.session,
			url: request?.protocol + "://" + request?.get("host"),
		}),
	} as any);

	const corsOptions = { credentials: true, origin: DEV_BASE_URL };

	server.express.use(sessionConfiguration);

	const PORT = process.env.PORT || 5000;
	const app = await server.start({
		cors: corsOptions,
		port: PORT,
		formatError: formatValidationError,
		subscriptions: {
			onConnect: () => console.log("Subscription server connected!"),
			onDisconnect: () => console.log("Subscription server disconnected!"),
		},
	});

	const beautifiedLog = {
		ENVIRONMENT: process.env.NODE_ENV?.trim(),
		PORT: app.address().port,
		DATABASE: conn.options.database,
	};

	console.table(beautifiedLog);
};
