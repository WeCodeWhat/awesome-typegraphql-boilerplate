import { ObjectType } from "type-graphql";
import { BeforeInsert, ChildEntity, JoinColumn, OneToOne } from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType("DirectConversationSchema")
@ChildEntity("DirectConversation")
export class DirectConversation extends Conversation {}
