import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/API_service/api.service';
import { VotingOperation } from '../models/VotingOperation';
import { UserDetailsService } from '../services/user_service/user-details.service';
import { VoteAnswer } from '../models/VoteAnswer';
import { House } from '../models/House';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { User } from '../models/User';



@Component({
  selector: 'app-poll-creation',
  templateUrl: './poll-creation.component.html',
  styleUrls: ['./poll-creation.component.css']
})
export class PollCreationComponent {

  newPoll: VotingOperation = {
    id: null,
    title: '',
    description: '',
    finishDate: new Date(),
    progress: 0,
    operationStatus: '',
    creator: '',
    voteAnswers: [], // Initialize the array
    votingUsers: [],
  };
  creator: string = '';
  answer: string = '';
  houses: House[] = [];
  votingOperations: VotingOperation[] = [];
  filteredHouses: House[] = [];
  selectedStreetForUnselectedHouses: string = '';
  selectedStreetForSelectedHouses: string = '';
  searchTerm: string = '';
  searchedHouses: House[] = [];
  filteredUnselectedHouses: House[] = [];
  filteredSelectedHouses: House[] = [];
  housesWithOwners: House[] = [];
  unselectedHouses: House[] = [];
  selectedHouses: House[] = [];
  searchTermForSelecting: string = '';
  searchTermForSelected: string = '';
  pollVoteAnswers: VoteAnswer[] = [];
  isEditing: boolean = false;

  constructor(private apiService: ApiService, private userDetailService: UserDetailsService, private router: Router, private route: ActivatedRoute) {
    combineLatest([
      this.apiService.getAllHouses(),
      this.apiService.getAllVotingOperations()
    ]).subscribe(([houses, votingOperationsFromDb]) => {
      this.houses = houses; // Update houses array when data changes
      // this.filteredHouses = this.houses;
      this.filterHousesOnlyWithOwners();
      this.unselectedHouses = this.housesWithOwners;
      this.filteredUnselectedHouses = this.unselectedHouses;

      this.votingOperations = votingOperationsFromDb;

      const votingOperationId = this.route.snapshot.params['id'];
      if (votingOperationId) {
        this.isEditing = true;
        this.newPoll = this.votingOperations.find(vo => vo.id === +votingOperationId)!;
        this.setSelectedHousesForEdit(this.newPoll.votingUsers);
      }
    });
    this.creator = this.userDetailService.getUserDetails().firstName + ' ' + this.userDetailService.getUserDetails().lastName;
  }

  saveNewPollOperation(newPollOperation: NgForm) {
    this.newPoll = newPollOperation.value;
    this.newPoll.creator = this.creator;
    this.newPoll.voteAnswers = this.pollVoteAnswers;
    if (this.selectedHouses && this.selectedHouses.length > 0) {
      // Extract users from selected houses and flatten the array
      this.newPoll.votingUsers = this.selectedHouses.map((house: House) => house.user);
    }
    console.log(this.newPoll);
    this.apiService.createVotingOperation(this.newPoll);
    this.router.navigate(['/dashboard/polls'])
  }

  

  addVoteAnswer(voteAnswerStr: string) {
    let voteAnswer: VoteAnswer = {} as VoteAnswer;
    voteAnswer.answer = voteAnswerStr;
    this.pollVoteAnswers = this.newPoll.voteAnswers;
    this.pollVoteAnswers.push(voteAnswer)
    this.newPoll.voteAnswers = this.pollVoteAnswers;
    this.answer = '';
  }

  removeAnswer(voteAnswer: VoteAnswer) {
    this.newPoll.voteAnswers = this.newPoll.voteAnswers.filter(answer => answer.answer !== voteAnswer.answer);
  }

  onStreetSelectForUnselectedHouses(event: Event) {
    this.selectedStreetForUnselectedHouses = (event.target as HTMLSelectElement).value;
  }

  onStreetSelectForSelectedHouses(event: Event) {
    this.selectedStreetForSelectedHouses = (event.target as HTMLSelectElement).value;
  }

  getAllStreets(): Set<string> {
    const streets = new Set<string>();
    for (const house of this.houses) {
      if (!streets.has(house.streetName))
        streets.add(house.streetName)
    }
    return streets;
  }

  searchHouses(searchCase: string): House[] {
    if (searchCase === 'unselected') {
      if (this.selectedStreetForUnselectedHouses === '') {
        return this.filteredUnselectedHouses = this.unselectedHouses;
      } else {
        return this.filteredUnselectedHouses = this.unselectedHouses.filter(house => house.streetName === this.selectedStreetForUnselectedHouses)
      }
    } else {
      if (this.selectedStreetForSelectedHouses === '') {
        return this.filteredSelectedHouses = this.selectedHouses;
      } else {
        return this.filteredSelectedHouses = this.selectedHouses.filter(house => house.streetName === this.selectedStreetForSelectedHouses)
      }
    }
  }

  filterHousesOnlyWithOwners(): House[] {
    this.housesWithOwners = this.houses.filter((house) => house.user.id !== null && house.user.enabled === true);
    return this.housesWithOwners;
  }

  updateFilteredHouses() {
    this.filteredUnselectedHouses = this.unselectedHouses;
  }

  updateSelectedHouses() {
    this.filteredSelectedHouses = this.selectedHouses;
  }
  selectHouse(house: House) {
    this.selectedHouses.push(house);
    const index = this.unselectedHouses.findIndex(obj => obj.id === house.id);
    if (index !== -1) {
      this.unselectedHouses.splice(index, 1);
    }
    this.updateFilteredHouses();
    this.updateSelectedHouses();
    this.searchHouses('unselected');
    this.searchHouses('');
  }

  removeFromSelected(house: House) {
    this.unselectedHouses.push(house);
    const index = this.selectedHouses.findIndex(obj => obj.id === house.id);
    if (index !== -1) {
      this.selectedHouses.splice(index, 1);
    }
    this.updateSelectedHouses();
    this.updateFilteredHouses();
    this.searchHouses('unselected');
    this.searchHouses('');
  }

  setSelectedHousesForEdit(votingUsers: User[]){
    for(const user of votingUsers){
      this.selectHouse(user.house)
    }
  }

}
