import { testFrame } from "../../../../test-utils/testFrame";
import { gCall } from "../../../../test-utils/gCall";
import { login as loginMutation } from "../../../graphql/mutations";

testFrame(() => {
	describe("Login test suite", () => {
		test("should be true", async () => {
			console.log(
				await gCall({
					source: loginMutation,
					variableValues: {
						data: {
							email: "tin",
							password: "1",
						},
					},
				})
			);
		});
	});
});
