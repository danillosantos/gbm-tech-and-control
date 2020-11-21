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

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbDialogModule.forRoot(),
    HomeRoutingModule,
    HttpClientModule,
    NbSpinnerModule
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: "pt-BR" },
    DashboardService
  ]
})
export class HomeModule {}
