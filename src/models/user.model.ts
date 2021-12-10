import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    MinLength,
    ValidateNested,
} from 'class-validator'
import { AddressModel } from './address.model'
import { PersonContactModel } from './person-contact.model'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class UserModel {
    id: number

    @ApiProperty()
    @IsEmail()
    @MinLength(2)
    email: string

    @IsPhoneNumber()
    @IsEmail()
    @MinLength(2)
    phone: string

    @ApiProperty()
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    @ApiProperty()
    lastName: string

    createdBy?: string

    updatedBy?: string

    @ApiProperty()
    @ValidateNested()
    @Type(() => AddressModel)
    registeredAddress: AddressModel

    @ApiProperty()
    @ValidateNested()
    @Type(() => AddressModel)
    billingAddress: AddressModel

    @ApiProperty()
    @ValidateNested()
    @Type(() => PersonContactModel)
    contactPerson: PersonContactModel

    @ApiProperty()
    @ValidateNested()
    @Type(() => PersonContactModel)
    billingPerson: PersonContactModel
}
