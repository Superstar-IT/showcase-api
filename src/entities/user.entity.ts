import { Entity, Column, Index, BeforeInsert } from "typeorm";
import bcrypt from "bcryptjs";

import Model from "./model.entity";

@Entity("users")
export class User extends Model {
  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
