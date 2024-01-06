import { User } from "./User";
import { VoteAnswer } from "./VoteAnswer";

export interface VotingOperation {
    id: any;
    title: string;
    description: string;
    finishDate: Date;
    progress: number;
    operationStatus: string;
    creator: string;
    voteAnswers: VoteAnswer[];
    votingUsers: User[];
}