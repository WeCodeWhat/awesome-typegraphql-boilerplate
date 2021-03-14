import { testFrame } from "../../../../test-utils/testFrame";
import { TestClient } from "../../../../test-utils/TestClient";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { yupErrorResponse } from "../../../../test-utils/yupErrorResponse";
import * as faker from "faker";

let client: TestClient | null = null;

const mockData = {
	email: faker.internet.email(),
	password: faker.internet.password(),
	firstName: faker.internet.userName(),
	lastName: faker.internet.userName(),
};

testFrame(() => {
	beforeAll(async () => {
		client = new TestClient("http://localhost:5000/graphql");
	});

	describe("Me test suite", () => {
		//FIXME session does not save userId on test server
		test("get current user", async () => {
			await client
				?.register(mockData)
				.then((res) => expect(res.register).toBeNull());
			await client
				?.login({
					email: mockData.email,
					password: mockData.password,
				})
				.then((res) => expect(res.login).toBeNull());
			await client
				?.me()
				.then((res) => expect(yupErrorResponse(res)).toEqual(mockData));
		});
	});
});
