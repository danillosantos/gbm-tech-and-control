import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import localePt from "@angular/common/locales/pt";
import { HttpClientModule } from "@angular/common/http";

registerLocaleData(localePt);
import {
  NbThemeModule,
  NbLayoutModule,
  NbContextMenuModule,
  NbActionsModule,
  NbMenuModule
} from "@nebular/theme";
import { DashboardService } from "./dashboard.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbActionsModule,
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    HttpClientModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule {}
