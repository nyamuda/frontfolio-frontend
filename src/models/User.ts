export class User {
  public constructor(
    public _id: number,
    public _name: string,
    public _email: string,
    public _isVerified: boolean,
    public _role: string,
  ) {}
}
