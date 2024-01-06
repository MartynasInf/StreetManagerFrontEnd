import { Component } from '@angular/core';
import { VotingService } from '../services/Vote_service/voting.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/API_service/api.service';
import { VotingOperation } from '../models/VotingOperation';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent {

  votingOperations: VotingOperation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  votersVotedPercentage = 0;
  selectedTab: string = 'active';

  constructor(private router: Router, private apiService: ApiService, private votingService: VotingService) {
    this.apiService.getAllVotingOperations().subscribe((votingOperationsFromDb: VotingOperation[]) => {
      this.votingOperations = votingOperationsFromDb; // Update houses array when data changes
    });
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.votingOperations.length ? this.votingOperations.length : end;
  }

  get totalRows(): number {
    return this.votingOperations.length;
  }


  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  updatePage(page: number): void {
    this.currentPage = page;
  }

  pollDetails(id: number) {
    this.router.navigate(['/dashboard/pollDetails', id]);
  }

  calculatePollVotingPercentage(votingOperation: VotingOperation): number{
    return this.votingService.calculateVotingProgressPercentage(votingOperation);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  showSelectedPolls(): VotingOperation[]{
    let filteredVotingOperations: VotingOperation[] = [];
    if(this.selectedTab === 'active'){
      filteredVotingOperations = this.votingOperations.filter(votingOp => votingOp.operationStatus === 'ACTIVATED' || votingOp.operationStatus === 'CREATED')
    } else {
      if(this.selectedTab === 'archived'){
        filteredVotingOperations = this.votingOperations.filter(votingOp => votingOp.operationStatus === 'ARCHIVED')
      }
    }
    return filteredVotingOperations;
  }
  createNewPoll(){
    this.router.navigate(['/dashboard/pollCreationForm']);
  }
}
