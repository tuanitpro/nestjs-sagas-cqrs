import { UserModel } from "@/models/user.model";

export class ModifyUserCommand{
    public constructor(public readonly id: number, public readonly model: UserModel){}
}