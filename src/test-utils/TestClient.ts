import { request } from "graphql-request";
import * as rp from "request-promise";
import * as GQLModules from "../modules/graphql";
import { LoginDto } from "../modules/resolvers/user/login/login.dto";
import { RegisterDto } from "../modules/resolvers/user/register/register.dto";
import * as fs from "fs";
interface GQL {
	mutations: any;
	queries: any;
	subscription: any;
}

const GQL: GQL = GQLModules;
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

	async mutation<T>(resolver: string, args: T) {
		return await request(this.url, GQL.mutations[resolver], { data: args })
			.then((data) => data)
			.catch((err) => err);
	}

	async query(resolver: string) {
		return await request(this.url, GQL.queries[resolver])
			.then((data) => data)
			.catch((err) => err);
	}

	async login(args: LoginDto) {
		return await this.mutation<LoginDto>("login", args);
	}

	async register(args: RegisterDto) {
		return await this.mutation<RegisterDto>("register", args);
	}

	async me() {
		return await this.query("me");
	}
}
