import { Field, ID, ObjectType } from "type-graphql";
import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
} from "typeorm";
import { User } from "./User";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "./Chat";
@ObjectType("ConversationSchema")
@Entity("Conversation")
export class Conversation extends BaseEntity {
	@Field(() => ID)
	@PrimaryColumn("uuid")
	id: string;

	@Field(() => String!)
	@Column("text")
	name: string;

	@Field(() => String!)
	@Column("text", { nullable: false, default: new Date().toISOString() })
	createdAt: string;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn()
	owner: User;

	@Field(() => [User!])
	@ManyToMany(() => User, (user) => user.conversations)
	@JoinTable()
	participants: User[];

	@Field(() => [Chat!])
	@OneToMany(() => Chat, (chat) => chat.conversation)
	messages: Chat[];

	@Field(() => String!)
	@Column("text", { nullable: true })
	ownerId: string;

	@BeforeInsert()
	async addOwnerId() {
		if (!this.ownerId) {
			this.ownerId = this.owner.id;
		}
	}

	@BeforeInsert()
	async addOwnerToMembers() {
		if (!this.participants) {
			this.participants = [];
			this.participants.push(this.owner);
		} else {
			this.participants.push(this.owner);
		}
	}

	@BeforeInsert()
	async addId() {
		this.id = uuidv4();
	}
}
