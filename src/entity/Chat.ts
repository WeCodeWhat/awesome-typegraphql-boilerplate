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
import { Room } from "./Room";

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

	@ManyToOne(() => Room, (room) => room.messages)
	room: Room;

	@BeforeInsert()
	async addId() {
		this.id = uuidv4();
	}
}
