import { CompanyService } from "./../services/company.service";
import { Member } from "src/app/models/member";
import { MemberService } from "./../services/member.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Company } from "src/app/models/company";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.css"]
})
export class CompaniesComponent implements OnInit {
  panelOpenState = true;
  companiesList: Company[];
  companyForm: FormGroup;
  displayedColumns: string[] = [
    "Nom",
    "Addresse",
    "Siret",
    "Activité",
    "Licenses",
    "Détails"
  ];
  dataSource = new MatTableDataSource<Company>();

  public contactList: FormArray;
  public teamList: FormArray;
  public phoneNumberList: FormArray;
  public emailList: FormArray;

  constructor(
    private memberService: MemberService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.companyForm = fb.group({
      name: fb.control("", [Validators.required]),
      address: fb.control("", [Validators.required]),
      siret: fb.control("", [Validators.required]),
      activity: fb.control("", [Validators.required]),
      totalLicenses: fb.control("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      // teams: fb.control('', this.fb.array([])),
      contacts: this.fb.array([this.createContact()]),
      teams: this.fb.array([this.createTeam()])
    });
    this.contactList = this.companyForm.get("contacts") as FormArray;
    this.teamList = this.companyForm.get("teams") as FormArray;
    this.phoneNumberList = (this.companyForm.get("contacts") as FormArray)
      .at(0)
      .get("phoneNumbers") as FormArray;
    this.emailList = (this.companyForm.get("contacts") as FormArray)
      .at(0)
      .get("emails") as FormArray;
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ngOnInit() {
    this.companyService.getCompanies().subscribe(
      companies => {
        console.log(companies);
        this.companiesList = companies;
        this.dataSource.data = this.companiesList;
      },
      err => {
        return;
      }
    );

    // this.dataSource.sort = this.sort;
  }

  createEmail(): FormGroup {
    return this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }
  addEmail() {
    this.emailList.push(this.createEmail());
  }
  removeEmail(index) {
    this.emailList.removeAt(index);
  }
  get emailFormGroup() {
    return this.contactFormGroup.get("emails") as FormArray;
  }

  createPhoneNumber(): FormGroup {
    return this.fb.group({
      phoneNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$")
        ])
      ]
    });
  }
  addPhoneNumber() {
    this.phoneNumberList.push(this.createPhoneNumber());
  }
  removePhoneNumber(index) {
    this.phoneNumberList.removeAt(index);
  }
  get phoneNumberFormGroup() {
    return this.contactFormGroup.get("phoneNumbers") as FormArray;
  }

  createTeam(): FormGroup {
    return this.fb.group({
      name: [null, Validators.compose([Validators.required])]
    });
  }
  addTeam() {
    this.teamList.push(this.createTeam());
  }
  removeTeam(index) {
    this.teamList.removeAt(index);
  }
  get teamFormGroup() {
    return this.companyForm.get("teams") as FormArray;
  }

  createContact(): FormGroup {
    return this.fb.group({
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      role: [null, Validators.compose([Validators.required])],
      isMainContact: [null, Validators.compose([Validators.required])],
      emails: this.fb.array([this.createEmail()]),
      phoneNumbers: this.fb.array([this.createPhoneNumber()])
    });
  }
  addContact() {
    this.contactList.push(this.createContact());
  }
  removeContact(index) {
    this.contactList.removeAt(index);
  }
  get contactFormGroup() {
    return this.companyForm.get("contacts") as FormArray;
  }

  // Recherche.
  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  createCompany() {
    const formValues = this.companyForm.value;
    // console.log(formValues);

    // const momentDate = new Date(formValues.birthDate);
    // const formattedDate = moment(momentDate).format("DD/MM/YYYY");

    const newCompany = {
      _id: undefined,
      name: formValues.name,
      address: formValues.address,
      siret: formValues.siret,
      activity: formValues.activity,
      teams: formValues.teams,
      totalLicenses: formValues.totalLicenses,
      usedLicenses: undefined,
      contacts: formValues.contacts,
      creationDate: undefined
    };

    this.companyService.addCompany(newCompany).subscribe(res => {
      this.openSnackBar("Entreprise ajoutée", "OK");
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
