import { EntityRepository } from "typeorm";
import { Conversation } from "../../../entity/Conversation";
import { IConversationRepository } from "./IConversationRepository";

@EntityRepository(Conversation)
export class ConversationRepository extends IConversationRepository<Conversation> {
	constructor() {
		super();
	}
}
