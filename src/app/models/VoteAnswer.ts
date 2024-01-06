import { User } from "./User";
import { VotingOperation } from "./VotingOperation";

export interface VoteAnswer {
    id: any;
    answer: string;
    votingOperation: VotingOperation;
    votedUsers: User[];
}