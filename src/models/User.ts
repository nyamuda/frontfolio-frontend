export class User {
  public constructor(
    public id: number,
    public name: string,
    public email: string,
    public isVerified: boolean,
    public role: string,
  ) {}
}
