import { EntityRepository } from "typeorm";
import { GroupConversation } from "../../../entity/GroupConversation";
import { ConversationRepository } from "./ConversationRepository";

@EntityRepository(GroupConversation)
export class GroupConversationRepository extends ConversationRepository<GroupConversation> {
	constructor() {
		super();
	}
}
