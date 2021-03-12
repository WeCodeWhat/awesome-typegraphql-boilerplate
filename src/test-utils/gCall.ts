import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "type-graphql";
import genSchema from "../utils/genSchema";
interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: Options) => {
	if (!schema) {
		schema = await genSchema();
	}
	return graphql({
		schema,
		variableValues,
		source,
	});
};
