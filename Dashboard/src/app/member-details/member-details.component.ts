import { Company } from 'src/app/models/company';
import { CompanyService } from './../services/company.service';
import { Member } from 'src/app/models/member';
import { MemberService } from './../services/member.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {

  member: Member;
  companies: Company[];
  editable = false;
  selectedCompany: any;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location,
    private companyService: CompanyService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getMember();
    // this.getCompany();
  }

  selectChanged(selectedValue) {
    this.selectedCompany = this.companies.find((element) => {
      return element.name === selectedValue;
    });
    console.log(this.selectedCompany);

  }

  editMember() {
    const id = this.route.snapshot.paramMap.get('id');
    this.memberService.putMember(this.member, id).subscribe((res) => {
      this.openSnackBar('Membre modifié', 'OK');
      this.editButton();
    });

  }
  editButton() {
    this.editable = !this.editable;
  }

  getMember(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.memberService.getMember(id)
      .subscribe((member) => {
        this.member = member;
        console.log(this.member);
        this.getCompany();
      })
  }

  
  getCompany() {
    this.companyService.getCompanies().subscribe((data) => {
      this.companies = data;

      this.selectedCompany = this.companies.find((element) => {
        return element.name === this.member.company;
      });

      console.log(this.companies);

    });
  }
  goBack(): void {
    this.location.back();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
