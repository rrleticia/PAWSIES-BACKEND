export class Owner {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly username: string;

  constructor(id: string, name: string, email: string, username: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
  }

  // Implementações de lógicas de negócio...
}
