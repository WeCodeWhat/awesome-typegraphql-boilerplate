import { AuthChecker } from "type-graphql";
import { GQLContext } from "./graphql-utils";

export const customAuthChecker: AuthChecker<GQLContext> = (
	{ root, args, context, info },
	roles
) => {
	// here we can read the user from context
	// and check his permission in the db against the `roles` argument
	// that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
	console.log(roles);
	return true; // or false if access is denied
};
