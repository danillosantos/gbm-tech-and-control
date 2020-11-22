import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbSpinnerModule
} from "@nebular/theme";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { DashboardService } from "../dashboard.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbDialogModule.forRoot(),
    HomeRoutingModule,
    HttpClientModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: "pt-BR" },
    DashboardService
  ]
})
export class HomeModule {}
