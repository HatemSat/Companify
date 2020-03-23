export class Expert {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    assignedMembers: { memberId: string, lastName: string, firstName: string }[];
    creationDate: string;
    flags: { isDeleted: boolean };
}
