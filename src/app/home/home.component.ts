import { Component, OnInit, TemplateRef } from "@angular/core";
import * as moment from "moment";
import { DashboardService } from "../dashboard.service";
import * as _ from "lodash";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  menu: any = [
    {
      name: "Status do Porto",
      active: true,
      index: 1
    },
    {
      name: "Fila de Navios",
      active: false,
      index: 2
    },
    {
      name: "Indicadores",
      active: false,
      index: 3
    }
  ];

  terminals: any = [];
  queue: any = [];
  tides: any = [];
  ranking: any = [];
  todayDay: any = moment().date();
  loading: boolean = false;
  quantityOfMooredShips: any = 0;
  quantityOfQueueShips: any = 0;
  totalOnBoard: any = 0;
  totalBoarded: any = 0;

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit() {
    await this.getTerminals();
    await this.getTides();
    await this.getQueue();
    await this.getRanking();
    this.getDashboardInformation();
  }

  async getDashboardInformation() {
    setTimeout(async () => {
      await this.getTerminals();
      await this.getTides();
      await this.getQueue();
      await this.getRanking();
    }, 1000 * 75);
  }

  async getRanking() {
    this.loading = true;
    this.dashboardService.getRanking().then((ranking:any) => {
      this.ranking = _.orderBy(ranking, ["adherence"], ["desc"]);
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });    
  }

  private async getTides() {
    let tides: any = await this.dashboardService.getTides();
    if (tides && tides.length > 0) {
      tides = _.orderBy(tides, ["date"], ["asc"]);
      tides = tides.filter((tide: any) => {
        return moment(moment().format("yyyy-MM-DD")).isSameOrBefore(tide.date);
      });
      tides[0].currentDay = true;
      tides[0].currentHour = moment().hour();
      this.tides = tides;
    }
    this.getCurrentHourFromTide();
  }

  private async getTerminals() {
    this.loading = true;
    let terminals: any = await this.dashboardService.getTerminals();
    if (terminals && terminals.length > 0) {
      this.terminals = _.orderBy(terminals, ["terminalSequence"], ["asc"]);
      this.getOperationTime();
      this.calculateBoardAdherence();
      this.getHeaderInformation();
      this.calculateTotalOnBoardPercentage();
    }
    this.loading = false;
  }

  private async getQueue() {
    this.loading = true;
    let queue: any = await this.dashboardService.getQueue();
    if (queue && queue.length > 0) {
      this.queue = queue;
      this.calculateAtAnchorDifference();
      this.getHeaderInformation();
    }
    this.loading = false;
  }

  checkDateNumber(date) {
    return moment(date).date();
  }

  changeActiveMenu(option: any) {
    this.menu.forEach(menu => {
      menu.active = false;
    });
    option.active = true;
  }

  private getCurrentHourFromTide() {
    let today: any = this.tides.find(tide => {
      return moment(tide.date).date() === this.todayDay;
    });
    let currentDay: any = today.period.find(period => {
      return period.hour === moment().hour();
    });
    currentDay.currentHour = true;
  }
  private calculateBoardAdherence() {
    this.terminals
      .map(terminal => {
        return terminal.ships;
      })
      .flat()
      .forEach(ship => {
        ship.loadingRate =
          (ship.currentLoadingRate / ship.minimumLoadingRate) * 100;
      });
  }

  expandTerminalCard(terminal) {
    terminal.expanded = !terminal.expanded;
  }

  private async getHeaderInformation() {
    this.quantityOfMooredShips = this.getAllShips("terminals", true);
    this.quantityOfQueueShips = this.getAllShips("queue", true);

    let shipsOnBoard = this.getAllShips("terminals");
    this.totalOnBoard = _.sumBy(shipsOnBoard, ship => {
      return +ship.totalOnBoard;
    });

    let response: any = await this.dashboardService.getTotalBoarded();
    this.totalBoarded = response.generalTotalBoarded;
  }

  seeShipDetails(terminal, ship) {
    if (!ship.active) {
      terminal.ships.forEach(ship => {
        delete ship.active;
      });
      ship.active = true;
      terminal.shipDetails = ship;
    } else {
      delete ship.active;
      delete terminal.shipDetails;
    }
  }

  getOperationTime() {
    let ships = this.terminals
      .map(terminal => {
        return terminal.ships;
      })
      .flat();

    ships.forEach(ship => {
      ship.operationalTime = this.getDifferenceBetweenDatesExcludesStoppagesHours(
        ship
      );
    });
  }

  private getAllShips(context: any, getLength: boolean = false) {
    let ships = this[context]
      .map(terminal => {
        return terminal.ships;
      })
      .flat();
    return getLength ? ships.length : ships;
  }

  private calculateAtAnchorDifference() {
    let ships = this.getAllShips("queue");
    ships.forEach(ship => {
      ship.amountOfHoursAnchored = this.getDifferenceBetweenDates(
        ship.atAnchorStartDate
      );
    });
  }

  private getDifferenceBetweenDates(field) {
    let labels = ["d", "h", "m"];
    let delta = Math.abs(moment().diff(field)) / 1000;

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let dates = (days + "," + hours + "," + minutes).split(",");
    for (var i = 0; i < labels.length; i++) {
      dates[i] = dates[i] + labels[i];
    }
    return dates.join(" ");
  }

  private getDifferenceBetweenDatesExcludesStoppagesHours(ship) {
    let labels = ["d", "h", "m"],
      delta: any;
    if (!ship.endShipmentDate) {
      delta =
        Math.abs(
          moment().diff(
            moment(ship.startShipmentDate).subtract(ship.stoppageHours, "hour")
          )
        ) / 1000;
    } else {
      delta =
        Math.abs(
          moment(ship.endShipmentDate).diff(
            moment(ship.startShipmentDate).subtract(ship.stoppageHours, "hour")
          )
        ) / 1000;
    }

    // calculate (and subtract) whole days
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let dates = (days + "," + hours + "," + minutes).split(",");
    for (var i = 0; i < labels.length; i++) {
      dates[i] = dates[i] + labels[i];
    }
    return dates.join(" ");
  }

  private calculateTotalOnBoardPercentage() {
    let ships = this.getAllShips("terminals");
    ships.forEach((ship: any) => {
      ship.percentageOnBoard = (ship.totalOnBoard / ship.totalManifested) * 100;
    });
  }
}
