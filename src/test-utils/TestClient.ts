import { gql, request } from "graphql-request";
import * as rp from "request-promise";
import * as GQL from "../modules/graphql";
import { LoginDto } from "../modules/resolvers/user/login/login.dto";
import { RegisterDto } from "../modules/resolvers/user/register/register.dto";
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

	async login(args: LoginDto) {
		return await request(this.url, GQL.mutations.login, {
			data: args,
		})
			.then((data) => data)
			.catch((err) => err);
	}

	async register(args: RegisterDto) {
		return await request(this.url, GQL.mutations.register, {
			data: args,
		})
			.then((data) => data)
			.catch((err) => err);
	}

	async me() {
		return await request(this.url, GQL.queries.me)
			.then((data) => data)
			.catch((err) => err);
	}
}
