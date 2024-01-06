import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/API_service/api.service';
import { VotingOperation } from '../models/VotingOperation';
import { VoteAnswer } from '../models/VoteAnswer';
import { UserDetailsService } from '../services/user_service/user-details.service';
import { loggedInUserDetails } from '../models/loggedInUserDetails';
import { VotingService } from '../services/Vote_service/voting.service';

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.css']
})
export class PollDetailsComponent {

  votingOperations: VotingOperation[] = [];
  votingOperationId: number | null = null;
  votingOperation: VotingOperation = {} as VotingOperation;
  isRequestFullyVoted: boolean = false;
  loggedInUser: loggedInUserDetails = {} as loggedInUserDetails;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private userDetailsInfoService: UserDetailsService,
    private votingService: VotingService,
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.votingOperationId = id ? +id : null; // Convert the string ID to a number or set to null if it's null
      // Fetch all payment requests from the API
      this.apiService.getAllVotingOperations().subscribe((votingRequestsFromDb: VotingOperation[]) => {
        this.votingOperations = votingRequestsFromDb;
        // Find the payment request after both ID and payment requests data are available
        this.votingOperation = this.getVotingOperation();
      });
    });
  }

  getVotingOperation(): VotingOperation {
    const votingRequest = this.votingOperations.find(request => request.id === this.votingOperationId);
    if (votingRequest) {
      return votingRequest;
    } else {
      return {
        id: -1,
        title: '',
        description: '',
        finishDate: new Date(1900, 1, 1),
        progress: 0,
        operationStatus: 'N/A',
        creator: '',
        voteAnswers: [],
        votingUsers: []
      }
    }
  }

  getVoteCountForAnswer(voteAnswer: VoteAnswer): number {
    const usersVotingCount = voteAnswer.votedUsers.length;
    return usersVotingCount;
  }

  calculatePercentsOfVoting(voteAnswer: VoteAnswer): number {
    const votersCount = this.votingOperation.votingUsers.length;
    const percentOfThisAnswer = this.getVoteCountForAnswer(voteAnswer) * 100 / votersCount;
    return percentOfThisAnswer;
  }

  changeVotingOperationStatus(operationId: number, operationStatus: string) {
    const newVotingOperation: VotingOperation = {} as VotingOperation;
    newVotingOperation.id = operationId;
    newVotingOperation.operationStatus = operationStatus;
    this.apiService.changeVotingRequestOperationStatus(newVotingOperation);
  }

  calculateVoteOperationProgressinPercentage() {
    this.votingService.calculateVotingProgressPercentage(this.votingOperation);
  }

  editVotingRequest(operationId: number) {
      this.router.navigate(['/dashboard/pollCreationForm/edit', operationId]);
  }

  deleteVotingRequest(votingOperationId: number) {
    this.apiService.deleteVotingOperation(votingOperationId);
    this.router.navigate(['/dashboard/polls'])
  }

  voteForAnAnswer(voteAnswer: VoteAnswer) {
    this.loggedInUser = this.userDetailsInfoService.getUserDetails();
    this.apiService.voteForTheAnswer(voteAnswer.id, this.loggedInUser.id)
  }

  userVotedStatus(userId: number): string {
    const isVoted = this.votingOperation.voteAnswers.some(answer => answer.votedUsers.some(user => user.id === userId))
    return isVoted ? 'Voted' : 'Not voted yet';
  }

  isVoingOperationFullyVoted(): boolean {
    const votePercentage = this.votingService.calculateVotingProgressPercentage(this.votingOperation);
    if (votePercentage === 100) {
      return true;
    } else {
      return false;
    }
  }
  voteButtonIsVisable(): boolean {
    this.loggedInUser = this.userDetailsInfoService.getUserDetails();
    const isVoted = this.votingOperation.voteAnswers.some(answer => answer.votedUsers.some(user => user.id === this.loggedInUser.id))
    return isVoted;
  }
}
