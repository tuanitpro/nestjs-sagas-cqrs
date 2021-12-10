import { UserModel } from "@/models/user.model";

export class CreateUserCommand{
    public constructor(public readonly model: UserModel){}
}