import { testFrame } from "../../../../test-utils/testFrame";
import { TestClient } from "../../../../test-utils/TestClient";
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
		client = new TestClient();
	});

	describe("Get users test suite", () => {
		test("should return empty array", async () => {
			await client?.user.getUsers().then((res) => {
				expect(res.getUsers).toHaveLength(0);
			});
		});
		test("should have 1 user", async () => {
			const user = await User.create(mockData).save();

			await client?.user.getUsers().then((res) => {
				expect(res.getUsers).toHaveLength(1);
				expect(res.getUsers).toMatchObject([
					{
						email: mockData.email,
						firstName: mockData.firstName,
						id: user.id,
						lastName: mockData.lastName,
						name: `${mockData.firstName} ${mockData.lastName}`,
						password: user.password,
						status: user.status,
					},
				]);
			});
		});
	});
});