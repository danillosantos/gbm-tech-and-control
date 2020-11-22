import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  constructor(public http: HttpClient) {}

  async getTerminals() {
    return await this.http
      .get(`${environment.apiUrl}/ships/moored`)
      .toPromise();
  }

  async getQueue() {
    return await this.http.get(`${environment.apiUrl}/ships/queue`).toPromise();
  }

  async getTides() {
    return await this.http.get(`${environment.apiUrl}/tides`).toPromise();
  }

  async getRanking() {
    return await this.http
      .get(`${environment.apiUrl}/terminals/ranking`)
      .toPromise();
  }

  async getTotalBoarded() {
    return await this.http
      .get(`${environment.apiUrl}/terminals/general-total-boarded`)
      .toPromise();
  }

  async getClimaTempoData() {
    return await this.http
      .get(`${environment.apiUrl}/tides/weather`)
      .toPromise();
  }

  async importFile(file: any) {
    var fd = new FormData();
    fd.append("file", file);
    return this.http.post(`${environment.apiUrl}/import/sheet`, fd).toPromise();
  }

  // add readme do projeto
}
