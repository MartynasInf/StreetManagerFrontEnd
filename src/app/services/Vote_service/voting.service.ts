import { Injectable } from '@angular/core';
import { VotingOperation } from 'src/app/models/VotingOperation';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  constructor() { }

  question: string = 'Uz zemes mokesti';
  options: { label: string; votes: number }[] = [];

  addOption(option: string): void {
    this.options.push({ label: option, votes: 0 });
  }

  vote(index: number): void {
    this.options[index].votes++;
  }

  calculateVotingProgressPercentage(votingOperation: VotingOperation): number{
    // const totalVoters = votingOperation.votingUsers.length;
    // let alreadyVotedUsers = 0;
    // for (let voteAnswer of votingOperation.voteAnswers){
    //   alreadyVotedUsers = alreadyVotedUsers + voteAnswer.votedUsers.length;
    // }
    // const totalVotedInPercentage = Math.round(alreadyVotedUsers / totalVoters * 100);
    // return totalVotedInPercentage;

    if (!votingOperation || !votingOperation.votingUsers || !votingOperation.voteAnswers) {
      // Handle the case when votingOperation or its properties are undefined or null
      return 0; // Or any default value that makes sense in your context
    }
  
    const totalVoters = votingOperation.votingUsers.length;
    let alreadyVotedUsers = 0;
  
    for (let voteAnswer of votingOperation.voteAnswers) {
      if (voteAnswer && voteAnswer.votedUsers) {
        alreadyVotedUsers += voteAnswer.votedUsers.length;
      }
    }
  
    const totalVotedInPercentage = Math.round(alreadyVotedUsers / totalVoters * 100);
    return totalVotedInPercentage;
  }
}
