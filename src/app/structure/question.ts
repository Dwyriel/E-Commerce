import { User } from "./user";

export class Question {
    //User question
    id: string;
    text: string;
    date: Date;
    idUser: string;
    user: User;

    //Vendor reply
    textVendor: string;
    replyDate: Date;
    hasReply: boolean;
}
