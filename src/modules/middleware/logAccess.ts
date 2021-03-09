import { MiddlewareFn } from "type-graphql";
import { GQLContext } from "../../utils/graphql-utils";

export const LogAccess: MiddlewareFn<GQLContext> = (
	{ context, info },
	next
) => {
	const user: string = context.session.userId || "guest";
	console.log(
		`Logging access: ${user} -> ${info.parentType.name}.${info.fieldName}`
	);
	return next();
};
