import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import genSchema from "./utils/genSchema";
import { sessionConfiguration } from "./helper/session";
import { REDIS } from "./helper/redis";
import { DEV_BASE_URL } from "./constants/global-variables";
import { env, EnvironmentType } from "./utils/environmentType";
import { formatValidationError } from "./utils/formatValidationError";
import { GQLContext } from "./utils/graphql-utils";
import { ContextParameters } from "graphql-yoga/dist/types";
import { genORMConnection } from "./config/orm.config";
import { printSchema } from "graphql";
import * as fs from "fs";

export const startServer = async () => {
	if (!env(EnvironmentType.PROD)) {
		await new REDIS().server.flushall();
	}

	const conn = await genORMConnection();

	const schema = await genSchema();
	const sdl = printSchema(schema);
	await fs.writeFileSync(__dirname + "/schema.graphql", sdl);

	const server = new GraphQLServer({
		schema,
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
		endpoint: process.env.SERVER_ENDPOINT,
		subscriptions: {
			onConnect: () => console.log("Subscription server connected!"),
			onDisconnect: () => console.log("Subscription server disconnected!"),
		},
	});

	console.table({
		ENDPOINT: `${process.env.SERVER_URI}:${app.address().port}${
			process.env.SERVER_ENDPOINT
		}`,
		ENVIRONMENT: process.env.NODE_ENV?.trim(),
		PORT: app.address().port,
		DATABASE: conn.options.database,
	});
};
