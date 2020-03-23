import { Location } from '@angular/common';
import { Expert } from './../models/expert';
import { ExpertService } from './../services/expert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../services/member.service';
import { MatSnackBar, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Member } from '../models/member';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-expert-details',
  templateUrl: './expert-details.component.html',
  styleUrls: ['./expert-details.component.css']
})
export class ExpertDetailsComponent implements OnInit {

  expert: Expert;
  editable = false;
  dataSource = new MatTableDataSource<Member>();
  memberList: Member[];
  displayedColumns: string[] = [
    '_id',
    'firstName',
    'lastName',
    'add'
  ];

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private expertService: ExpertService,
    private location: Location,
    private snackBar: MatSnackBar) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.expertService.getExpert(id)
      .subscribe((expert) => {
        this.expert = expert;
        console.log(this.expert);

        this.memberService.getMembers().subscribe((members) => {
          console.log(members);
          this.memberList = members;
          this.dataSource.data = this.memberList;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }, (err) => { return; });
      });


  }
  doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  editExpert() {
    const id = this.route.snapshot.paramMap.get('id');
    this.expertService.putExpert(this.expert, id).subscribe((res) => {
      this.openSnackBar('Expert modifié', 'OK');
    });
    this.editButton();
    console.log(this.expert);
  }

  editButton() {
    this.editable = !this.editable;
  }


  removeMember(member: any) {
    const index = this.expert.assignedMembers.findIndex((ex) => {
      return ex.memberId === member._id;
    });
    this.expert.assignedMembers.splice(index, 1);
    this.openSnackBar('Membre supprimé', 'OK');
  }

  addMember(member: any) {

    const newMember = {
      memberId: member._id,
      lastName: member.lastName,
      firstName: member.firstName
    };

    if (this.expert.assignedMembers.find((ex) => {
      return ex.memberId === member._id;
    })) {
      this.openSnackBar('Membre deja ajouté', 'OK');
      return;
    }
    this.expert.assignedMembers.push(newMember);
    this.openSnackBar('Membre ajouté', 'OK');
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
