import { Location } from "@angular/common";
import { ExpertService } from "./../services/expert.service";
import { Expert } from "./../models/expert";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-experts",
  templateUrl: "./experts.component.html",
  styleUrls: ["./experts.component.css"]
})
export class ExpertsComponent implements OnInit, OnDestroy {
  panelOpenState = true;
  expertsList: Expert[];
  selectedCompany: any;
  expertForm: FormGroup;

  displayedColumns: string[] = [
    "_id",
    "firstName",
    "lastName",
    "email",
    "birthDate",
    "gender",
    "assignedMembers",
    "creationDate",
    "Détails"
  ];

  dataSource = new MatTableDataSource<Expert>();

  constructor(
    private expertService: ExpertService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.expertForm = fb.group({
      lastName: fb.control("", [Validators.required]),
      firstName: fb.control("", [Validators.required]),
      email: fb.control("", [Validators.required, Validators.email]),
      birthDate: fb.control("", [Validators.required]),
      gender: fb.control("", [Validators.required]).setValue({ onlySelf: true })
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.expertService.getExperts().subscribe(
      experts => {
        this.expertsList = experts;
        this.dataSource.data = this.expertsList;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => {
        return;
      }
    );
  }
  ngOnDestroy(): void {}

  get email() {
    return this.expertForm.get("email");
  }

  // Recherche.
  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  createExpert() {
    const formValues = this.expertForm.value;
    const momentDate = new Date(formValues.birthDate);
    const formattedDate = moment(momentDate).format("DD/MM/YYYY");

    const newExpert = {
      _id: undefined,
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      birthDate: formattedDate,
      gender: formValues.gender,
      creationDate: undefined,
      assignedMembers: undefined,
      flags: { isDeleted: undefined, isRegisterComplete: undefined }
    };

    this.expertService.addExpert(newExpert).subscribe(
      response => {
        if (response.status === "success") {
          this.openSnackBar("Expert ajouté", "OK");
          this.expertForm.reset();
          this.expertService.getExperts().subscribe(data => {
            this.expertsList = data;
            this.dataSource.data = this.expertsList;
            this.changeDetectorRefs.detectChanges();
          });
        }
      },
      err => {
        this.openSnackBar("Erreur lors de l'ajout", "OK");
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
