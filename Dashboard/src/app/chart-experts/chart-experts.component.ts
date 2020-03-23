import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { Label } from "ng2-charts";
import { ExpertService } from "../services/expert.service";
import { MemberService } from "../services/member.service";
import { Expert } from "../models/expert";
import { Member } from "../models/member";
import * as _ from "underscore";

@Component({
  selector: "app-chart-experts",
  templateUrl: "./chart-experts.component.html",
  styleUrls: ["./chart-experts.component.css"]
})
export class ChartExpertsComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      position: "bottom",
      text: "Nombre d'experts par classes de nombres de membres"
    }
  };
  // public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels: Label[] = ["[0-1]", "[2-3]", "[3-4]", "[4+]"];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Experts" }
  ];
  public experts: Expert[];
  public members: Member[];

  constructor(
    private expertService: ExpertService,
    private memberService: MemberService
  ) {
    expertService.getExperts().subscribe(experts => {
      this.experts = experts;
      memberService.getMembers().subscribe(members => {
        this.members = members;
        this.processData(experts, members);
      });
    });
  }

  ngOnInit() {}
  processData(experts: Expert[], members: Member[]) {
    let tab = [],
      res;
    experts.forEach(expert => {
      tab.push(expert.assignedMembers.length);
    });
    res = _.countBy(tab, val => {
      if (val < 2) {
        return "One";
      } else if (val === 2 || val === 3) {
        return "Two";
      } else if (val === 3 || val === 4) {
        return "Three";
      } else if (val > 4) {
        return "Four";
      }
    });
    if (Object.keys(res).indexOf("One") === -1) {
      res.One = 0;
    }
    if (Object.keys(res).indexOf("Two") === -1) {
      res.Two = 0;
    }
    if (Object.keys(res).indexOf("Three") === -1) {
      res.Three = 0;
    }
    if (Object.keys(res).indexOf("Four") === -1) {
      res.Four = 0;
    }
    let newObj: any = {};
    newObj.One = res.One;
    newObj.Two = res.Two;
    newObj.Three = res.Three;
    newObj.Four = res.Four;
    let data = Object.values(newObj);
    this.barChartData[0].data = data;
  }
}
