import { Field, ID, ObjectType } from "type-graphql";
import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	ManyToOne,
	PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";
import { Conversation } from "./Conversation";

@ObjectType("ChatSchema")
@Entity("Chat")
export class Chat extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn("uuid")
	id: String;

	@Field(() => User!, { nullable: true })
	@ManyToOne(() => User)
	sender: User;

	@Field(() => String!)
	@Column("text", { nullable: false })
	message: String;

	@Field(() => String!)
	@Column("text", { nullable: false, default: new Date().toISOString() })
	createdAt: String;

	@ManyToOne(() => Conversation, (conversation) => conversation.messages)
	conversation: Conversation;

	@BeforeInsert()
	async addId() {
		this.id = uuidv4();
	}
}
