import { User } from "./user";

export class Question {
    id: string;
    text: string;
    date: Date;
    idUser: string;
    user: User;
}
