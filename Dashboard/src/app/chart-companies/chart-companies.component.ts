import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Colors, Color } from 'ng2-charts';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company';
import * as _ from 'underscore'

//  Nombre de companies en fonction du secteur d'activité
@Component({
  selector: 'app-chart-companies',
  templateUrl: './chart-companies.component.html',
  styleUrls: ['./chart-companies.component.css']
})
export class ChartCompaniesComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public colors = [{ backgroundColor: ["#e84351", "#1b5dd1", "#3ebf9b"] }];
  public options = {
    title: {
      display: true,
      position: 'bottom',
      text: 'Parts d\'entreprises par secteur d\'activité'
    }
  }
  constructor(private companyService: CompanyService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();

    this.pieChartData = [];
    this.companyService.getCompanies().subscribe((companies) => {
      this.processValues(companies)
    })
  }

  processValues(companies: Company[]) {
    let label: string[] = [], values: number[], labels: string[]
    companies.forEach((val) => {
      label.push(val.activity)
    })
    labels = _.uniq(label)
    values = _.values(_.countBy(label, (elem) => {
      return elem
    }))
    labels.forEach((lab) => { this.pieChartLabels.push(lab) })
    values.forEach((data) => { this.pieChartData.push(data) })
  }

  ngOnInit() {
  }








}
