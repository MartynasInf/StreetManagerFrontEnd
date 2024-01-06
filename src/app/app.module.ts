import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { UserInformationComponent } from './user-information/user-information.component';

import { UsersComponent } from './users/users.component';
import { HousesComponent } from './houses/houses.component';
import { NewsComponent } from './news/news.component';
import { PaymentRequestsComponent } from './payment-requests/payment-requests.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { PollsComponent } from './polls/polls.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { PaymentRequestCreateFormComponent } from './payment-request-create-form/payment-request-create-form.component'
import { FilterPipe } from './services/filtering_service/filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaymentRequestDetailsComponent } from './payment-request-details/payment-request-details.component';
import { PollDetailsComponent } from './poll-details/poll-details.component';
import { PollCreationComponent } from './poll-creation/poll-creation.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    NavbarComponent,
    UserInformationComponent,
    UsersComponent,
    HousesComponent,
    NewsComponent,
    PaymentRequestsComponent,
    FooterComponent,
    DashboardMenuComponent,
    DashboardFooterComponent,
    DashboardHeaderComponent,
    PollsComponent,
    StatisticsComponent,
    AdvertisementsComponent,
    PaymentRequestCreateFormComponent,
    FilterPipe,
    PaymentRequestDetailsComponent,
    PollDetailsComponent,
    PollCreationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
