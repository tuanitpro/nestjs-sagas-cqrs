import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ContactModel {
    id?: number

    @ApiProperty()
    @IsNotEmpty()
    firstName: string

    @ApiProperty()
    middleName: string

    @ApiProperty()
    lastName: string

    @IsEmail()
    @MinLength(2)
    email: string

    @ApiProperty()
    @IsNotEmpty()
    contactOffice: string

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string
}
