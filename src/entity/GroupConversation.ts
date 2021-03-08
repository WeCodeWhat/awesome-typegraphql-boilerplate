import { Field, ObjectType } from "type-graphql";
import {
	BeforeInsert,
	ChildEntity,
	Column,
	JoinColumn,
	ManyToOne,
} from "typeorm";
import { GroupConversationVisibility } from "../shared/ConversationVisibility";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType("GroupConversationSchema")
@ChildEntity("GroupConversation")
export class GroupConversation extends Conversation {
	@Field(() => String!)
	@Column("text")
	name: string;

	@Field(() => User!)
	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn()
	owner: User;

	@Field(() => GroupConversationVisibility!)
	@Column("text", { nullable: false })
	visibility: GroupConversationVisibility;

	@BeforeInsert()
	async addOwnerToParticipants() {
		if (!this.participants) {
			this.participants = [];
			this.participants.push(this.owner);
		} else {
			this.participants.push(this.owner);
		}
	}
}
