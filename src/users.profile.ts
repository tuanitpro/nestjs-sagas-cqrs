import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserModel } from '@/models/user.model';
import { AddressModel } from '@models/address.model';
import { PersonContactModel } from '@models/person-contact.model';
import { user, addressField, contactField } from '@prisma/client';

@Injectable()
export class UsersProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper: Mapper) => {
            mapper
                .createMap<user, UserModel>('user', 'UserModel')
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination) => destination.firstName,
                    mapFrom((source) => source.firstName),
                )
                .forMember(
                    (destination) => destination.lastName,
                    mapFrom((source) => source.lastName),
                )
               
                .forMember(
                    (destination) => destination.createdBy,
                    mapFrom((source) => source.createdBy),
                )
                .forMember(
                    (destination) => destination.updatedBy,
                    mapFrom((source) => source.updatedBy),
                )
              

            mapper
                .createMap<UserModel, user>('UserModel', 'user')
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination) => destination.firstName,
                    mapFrom((source) => source.firstName),
                )
                .forMember(
                    (destination) => destination.lastName,
                    mapFrom((source) => source.lastName),
                )
                 
                .forMember(
                    (destination) => destination.createdBy,
                    mapFrom((source) => source.createdBy),
                )
                .forMember(
                    (destination) => destination.updatedBy,
                    mapFrom((source) => source.updatedBy),
                )
               

            mapper
                .createMap<addressField, AddressModel>('addressField', 'AddressModel')
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination) => destination.country,
                    mapFrom((source) => source.country),
                )
                .forMember(
                    (destination) => destination.state,
                    mapFrom((source) => source.state),
                )
                .forMember(
                    (destination) => destination.city,
                    mapFrom((source) => source.city),
                )
                .forMember(
                    (destination) => destination.postalCode,
                    mapFrom((source) => source.postalCode),
                )
                .forMember(
                    (destination) => destination.street1,
                    mapFrom((source) => source.street1),
                )
                .forMember(
                    (destination) => destination.street2,
                    mapFrom((source) => source.street2),
                )
                .forMember(
                    (destination) => destination.building,
                    mapFrom((source) => source.building),
                )
                .forMember(
                    (destination) => destination.blockNumber,
                    mapFrom((source) => source.blockNumber),
                )
                .forMember(
                    (destination) => destination.unitNumber,
                    mapFrom((source) => source.unitNumber),
                );

            mapper
                .createMap<AddressModel, addressField>('AddressModel', 'addressField')
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination) => destination.country,
                    mapFrom((source) => source.country),
                )
                .forMember(
                    (destination) => destination.state,
                    mapFrom((source) => source.state),
                )
                .forMember(
                    (destination) => destination.city,
                    mapFrom((source) => source.city),
                )
                .forMember(
                    (destination) => destination.postalCode,
                    mapFrom((source) => source.postalCode),
                )
                .forMember(
                    (destination) => destination.street1,
                    mapFrom((source) => source.street1),
                )
                .forMember(
                    (destination) => destination.street2,
                    mapFrom((source) => source.street2),
                )
                .forMember(
                    (destination) => destination.building,
                    mapFrom((source) => source.building),
                )
                .forMember(
                    (destination) => destination.blockNumber,
                    mapFrom((source) => source.blockNumber),
                )
                .forMember(
                    (destination) => destination.unitNumber,
                    mapFrom((source) => source.unitNumber),
                );

            mapper
                .createMap<contactField, PersonContactModel>(
                    'contactField',
                    'PersonContactModel',
                )
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination) => destination.firstName,
                    mapFrom((source) => source.firstName),
                )
                .forMember(
                    (destination) => destination.middleName,
                    mapFrom((source) => source.middleName),
                )
                .forMember(
                    (destination) => destination.lastName,
                    mapFrom((source) => source.lastName),
                )
                .forMember(
                    (destination) => destination.email,
                    mapFrom((source) => source.email),
                )
                .forMember(
                    (destination) => destination.phoneNumber,
                    mapFrom((source) => source.phoneNumber),
                )
                .forMember(
                    (destination) => destination.contactOffice,
                    mapFrom((source) => source.contactOffice),
                );

            mapper
                .createMap<PersonContactModel, contactField>(
                    'PersonContactModel',
                    'contactField',
                )
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination) => destination.firstName,
                    mapFrom((source) => source.firstName),
                )
                .forMember(
                    (destination) => destination.middleName,
                    mapFrom((source) => source.middleName),
                )
                .forMember(
                    (destination) => destination.lastName,
                    mapFrom((source) => source.lastName),
                )
                .forMember(
                    (destination) => destination.email,
                    mapFrom((source) => source.email),
                )
                .forMember(
                    (destination) => destination.phoneNumber,
                    mapFrom((source) => source.phoneNumber),
                )
                .forMember(
                    (destination) => destination.contactOffice,
                    mapFrom((source) => source.contactOffice),
                );
        };
    }
}
