import { CompanyService } from "./../services/company.service";
import { Member } from "src/app/models/member";
import { MemberService } from "./../services/member.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material";
import { Company } from "src/app/models/company";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { log } from "util";
declare var $: any;

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.css"]
})
export class MembersComponent implements OnInit, OnDestroy {
  panelOpenState = true;
  memberList: Member[];
  companiesList: Company[];
  selectedCompany: any;
  toto = "hello";
  memberForm: FormGroup;

  displayedColumns: string[] = [
    "_id",
    "firstName",
    "lastName",
    "email",
    "birthDate",
    "gender",
    "post",
    "company",
    "team",
    "creationDate",
    "Détails"
  ];
  dataSource = new MatTableDataSource<Member>();

  constructor(
    private memberService: MemberService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = fb.group({
      lastName: fb.control("", [Validators.required]),
      firstName: fb.control("", [Validators.required]),
      email: fb.control("", [Validators.required, Validators.email]),
      post: fb.control("", [Validators.required]),
      company: fb
        .control("", [Validators.required])
        .setValue({ onlySelf: true }),
      team: fb.control("", [Validators.required]).setValue({ onlySelf: true }),
      birthDate: fb.control("", [Validators.required]),
      gender: fb.control("", [Validators.required]).setValue({ onlySelf: true })
    });
    this.memberForm.reset();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.memberService.getMembers().subscribe(
      members => {
        console.log(members);
        this.memberList = members;
        this.dataSource.data = this.memberList;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        return;
      }
    );

    this.companyService.getCompanies().subscribe(
      companies => {
        console.log(companies);
        this.companiesList = companies;
      },
      err => {
        return;
      }
    );
  }
  ngOnDestroy(): void {}

  get email() {
    return this.memberForm.get("email");
  }

  // Recherche.
  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  modelchanged() {
    console.log(this.selectedCompany.name);
  }

  createMember() {
    const formValues = this.memberForm.value;
    const momentDate = new Date(formValues.birthDate);
    const formattedDate = moment(momentDate).format("DD/MM/YYYY");

    const newMember = {
      _id: undefined,
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      birthDate: formattedDate,
      gender: formValues.gender,
      post: formValues.post,
      team: formValues.team,
      company: formValues.company.name,
      creationDate: undefined,
      flags: { isDeleted: undefined, isRegisterComplete: undefined }
    };

    this.memberService.addMember(newMember).subscribe(
      response => {
        console.log(response);
        if (response.status === "success") {
          this.openSnackBar("Membre ajouté", "OK");
          this.memberForm.reset();
          this.memberList.push(response.member);
        } else if (response.status === "error") {
          this.openSnackBar(response.message, "OK");
        }
      },
      err => {
        this.openSnackBar(
          "Erreur lors de l'ajout : " + err.error.message,
          "OK"
        );
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000
    });
  }
}
