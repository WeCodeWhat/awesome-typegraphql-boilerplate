import { EntityRepository } from "typeorm";
import { GroupConversation } from "../../../entity/GroupConversation";
import { IConversationRepository } from "./IConversationRepository";

@EntityRepository(GroupConversation)
export class GroupConversationRepository extends IConversationRepository<GroupConversation> {
	constructor() {
		super();
	}
}
