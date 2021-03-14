import { testFrame } from "../../../../test-utils/testFrame";
import { TestClient } from "../../../../test-utils/TestClient";
import { CustomMessage } from "../../../../shared/CustomMessage.enum";
import { yupErrorResponse } from "../../../../test-utils/yupErrorResponse";
import * as faker from "faker";
import { User } from "../../../../entity/User";

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
			await client?.me().then((res) =>
				expect(res).toEqual({
					conversations: [],
					email: mockData.email,
					firstName: mockData.firstName,
					id: "4160e62e-2e14-41fb-8d3f-3de98fbc4576",
					lastName: mockData.lastName,
					name: `${mockData.firstName} ${mockData.lastName}`,
					password:
						"$2b$10$vq4sRdJ3bEimiWDUm5D.eu5QENhK35d9xDZwtdlCTQNwVy7arxVJ2",
					status: "none",
				})
			);
		});
	});
});
