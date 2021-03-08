import { EntityRepository } from "typeorm";
import { DirectConversation } from "../../../entity/DirectConversation";
import { ConversationRepository } from "./ConversationRepository";

@EntityRepository(DirectConversation)
export class DirectConversationRepository extends ConversationRepository<DirectConversation> {
	constructor() {
		super();
	}
}
