export class Company {
  name: string;
  address: string;
  siret: string;
  activity: string;
  totalLicenses: number;
  usedLicenses: number;
  creationDate: string;
  contacts: { firstName: string, lastName: string, role: string, emails: { email: string }[], phoneNumbers: { phoneNumber: string }[] }[];
  teams: [{ name: string }];
}
