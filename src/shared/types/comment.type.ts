import {User} from './user.type.js';

export type Comment = {
    comment: string;
    date: string | Date;
    rating: number;
    author: User;
}
