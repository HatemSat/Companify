import { MemberService } from "./../services/member.service";
import { Company } from "src/app/models/company";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CompanyService } from "../services/company.service";
import { Member } from "../models/member";
import { Location } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.css"]
})
export class CompanyDetailsComponent implements OnInit {
  company: Company;
  members: Member[];
  editable = false;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCompany();
  }

  getCompany(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.companyService.getCompany(id).subscribe(company => {
      this.company = company;
      console.log(this.company);
    });
  }

  editButton() {
    this.editable = !this.editable;
  }

  goBack(): void {
    this.location.back();
  }

  saveCompany() {
    this.companyService
      .putCompany(this.company, this.route.snapshot.paramMap.get("id"))
      .subscribe(res => {
        this.openSnackBar("Entreprise modifiée", "OK");
        this.editButton();
      });
  }

  addContact() {
    const newContact = {
      firstName: " ",
      lastName: " ",
      role: " ",
      emails: [{ email: " " }],
      phoneNumbers: [{ phoneNumber: " " }]
    };
    this.company.contacts.push(newContact);
  }

  addEmail(contact) {
    const newMail = {};
    contact.emails.push(newMail);
  }

  addPhone(contact) {
    const newPhoneNumber = {};
    contact.phoneNumbers.push(newPhoneNumber);
  }

  removeContact(contact) {
    const index = this.company.contacts.findIndex(cont => {
      return cont.role === contact.role;
    });
    this.company.contacts.splice(index, 1);
  }

  removePhone(contact, tel) {
    const index = this.company.contacts.findIndex(cont => {
      return cont.role === contact.role;
    });
    const index2 = this.company.contacts[index].phoneNumbers.findIndex(
      object => {
        return object.phoneNumber === tel.phoneNumber;
      }
    );
    this.company.contacts[index].phoneNumbers.splice(index2, 1);
  }

  removeEmail(contact, email) {
    const index = this.company.contacts.findIndex(cont => {
      return cont.role === contact.role;
    });
    const index2 = this.company.contacts[index].emails.findIndex(object => {
      return object.email === email.email;
    });
    this.company.contacts[index].emails.splice(index2, 1);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
