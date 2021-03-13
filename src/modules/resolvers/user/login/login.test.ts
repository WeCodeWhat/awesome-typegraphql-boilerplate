import { testFrame } from "../../../../test-utils/testFrame";
import { TestClient } from "../../../../test-utils/TestClient";
import { login as loginMutation } from "../../../graphql/mutations";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { yupErrorResponse } from "../../../../test-utils/yupErrorResponse";

let client: TestClient | null = null;

testFrame(() => {
	beforeAll(() => {
		client = new TestClient("http://localhost:5000/graphql");
	});

	describe("Login test suite", () => {
		test("account is not register", async () => {
			expect(
				await client?.login({
					email: "tin@email.com",
					password: "123",
				})
			).toEqual({
				login: {
					message: CustomMessage.accountIsNotRegister,
					path: "email",
				},
			});
		});

		test("[Yup] invalid email address", async () => {
			const data = await client?.login({
				email: "tin",
				password: "123",
			});
			expect(yupErrorResponse(data)).toEqual([
				{
					message: CustomMessage.inValidEmailAddress,
					path: "email",
				},
			]);
		});

		test("[Yup]password length matched", async () => {
			const data = await client?.login({
				email: "tin@email.com",
				password: "1",
			});
			expect(yupErrorResponse(data)).toEqual([
				{
					message: "password must be at least 3 characters",
					path: "password",
				},
			]);
		});

		test("[Yup] invalid email address & password length matched", async () => {
			const data = await client?.login({
				email: "tin",
				password: "1",
			});
			expect(yupErrorResponse(data)).toEqual([
				{
					message: CustomMessage.inValidEmailAddress,
					path: "email",
				},
				{
					message: "password must be at least 3 characters",
					path: "password",
				},
			]);
		});
	});
});
