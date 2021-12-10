import { UserModel } from "@/models/user.model";

export class RemoveUserCommand{
    public constructor(public readonly model: UserModel){

    }
}