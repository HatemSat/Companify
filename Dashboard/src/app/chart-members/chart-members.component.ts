import { Component, OnInit } from "@angular/core";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { MemberService } from "../services/member.service";
import { Member } from "../models/member";
import * as _ from "underscore";

@Component({
  selector: "app-chart-members",
  templateUrl: "./chart-members.component.html",
  styleUrls: ["./chart-members.component.css"]
})
export class ChartMembersComponent implements OnInit {
  constructor(private memberService: MemberService) {
    this.memberService.getMembers().subscribe(members => {
      this.processData(members);
    });
  }

  ngOnInit() {}

  processData(members: Member[]) {
    let tab = [],
      res: number[] = [];
    members.forEach(member => {
      tab.push(member.creationDate.split("/")[1]);
    });
    res = _.values(
      _.countBy(tab, val => {
        return val;
      })
    );
    this.lineChartData[0].data = res;
  }
  public options = {
    title: {
      display: true,
      position: "bottom",
      text: "Nombre de membres inscrits par mois de l'année"
    }
  };

  lineChartData: ChartDataSets[] = [{ data: [], label: "Membres" }];

  lineChartLabels: Label[] = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ];

  lineChartOptions = {
    responsive: true
  };

  lineChartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,255,0,0.28)"
    }
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = "line";
}
