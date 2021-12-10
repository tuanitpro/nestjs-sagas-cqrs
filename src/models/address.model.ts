import { IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class AddressModel {
    id?: number

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(3)
    country: string

    @ApiProperty()
    @IsNotEmpty()
    state: string

    @ApiProperty()
    @IsNotEmpty()
    city: string

    @ApiProperty()
    @IsNotEmpty()
    postalCode: string

    @IsNotEmpty()
    street1: string

    street2: string

    building: string

    blockNumber: string

    unitNumber: string
}
