import { EntityRepository, Repository } from "typeorm";
import { Message } from "../../entity/Message";
import { Conversation } from "../../entity/Conversation";

@EntityRepository(Message)
export class ChatRepository extends Repository<Message> {}
