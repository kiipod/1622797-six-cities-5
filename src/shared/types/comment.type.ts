import { User } from './user.type.js';

export type Comment = {
    text: string;
    date: string | Date;
    grade: number;
    author: User;
}
