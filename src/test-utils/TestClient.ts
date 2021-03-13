import { gql, request } from "graphql-request";
import * as rp from "request-promise";
import * as GQL from "../modules/graphql";
import { LoginDto } from "../modules/resolvers/user/login/login.dto";
export class TestClient {
	url: string;
	options: {
		jar: any;
		json: boolean;
		withCredentials: boolean;
	};
	constructor(url: string) {
		this.url = url;
		this.options = {
			jar: rp.jar(),
			json: true,
			withCredentials: true,
		};
	}

	async login({ email, password }: LoginDto) {
		return await request(this.url, GQL.mutations.login, {
			data: {
				email,
				password,
			},
		})
			.then((data) => data)
			.catch((err) => err);
	}
}
