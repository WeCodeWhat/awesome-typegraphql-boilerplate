import { EntityRepository, Repository } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Room } from "../../entity/Room";

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {}
