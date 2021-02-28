import { EntityRepository, Repository } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Conversation } from "../../entity/Conversation";

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {}
