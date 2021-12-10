import { Injectable, Logger } from '@nestjs/common';
import { UserModel } from '@/models/user.model';
import { QueryParamModel } from '@models/query-param.model';
import { MetaDataModel, PaginationModel } from '@models/pagination.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AddressModel } from '@models/address.model';
import { PersonContactModel } from '@models/person-contact.model';
import { PrismaService } from '@services/prisma.service';
import { addressField, contactField, user } from '@prisma/client';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectMapper() private mapper: Mapper,
        private readonly prisma: PrismaService,
    ) { }

    async findAllAsync(): Promise<user[]> {
        const data: user[] = await this.prisma.user.findMany({
            include: {
                registeredAddress: true,
                billingAddress: true,
                contactPerson: true,
                billingPerson: true,
            },
        });

        return data;
    }

    async searchAsync(query: QueryParamModel): Promise<PaginationModel> {
        const limit: number = Number(query.limit) || 10;
        const page: number = Number(query.page) || 1;
        const keyword: string = query.keyword || '';

        const where = {
            isDeleted: false,
            businessName: {
                contains: keyword,
            },

        }
        const results: any = await this.prisma.user.findMany({
            include: {
                registeredAddress: true,
                billingAddress: true,
                contactPerson: true,
                billingPerson: true,
            },
            where,
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalRecords: number = await this.prisma.user.count({
            where
        })
        const models: UserModel[] = results.map((data) => {
            const model: UserModel = this.mapper.map(
                data,
                'UserModel',
                'user',
            );
            model.registeredAddress = data?.registeredAddress;
            model.billingAddress = data?.billingAddress;
            model.contactPerson = data?.contactPerson;
            model.billingPerson = data?.billingPerson;
            return model;
        });

        const model: PaginationModel = {
            data: models,
            metadata: {
                total: totalRecords,
                page: page,
                limit: limit,
            },
        };
        return model;
    }

    async findByIdAsync(id: number): Promise<UserModel | Error> {
        try {
            const data: any = await this.prisma.user.findFirst({
                include: {
                    registeredAddress: true,
                    billingAddress: true,
                    contactPerson: true,
                    billingPerson: true,
                },
                where: { id: Number(id), isDeleted: false },
            });

            const model: UserModel = this.mapper.map(
                data,
                'user',
                'UserModel',
            );
            model.registeredAddress = data?.registeredAddress;
            model.billingAddress = data?.billingAddress;
            model.contactPerson = data?.contactPerson;
            model.billingPerson = data?.billingPerson;
            return model;
        } catch (e) {
            return new Error(e);
        }
    }

    async createAsync(model: UserModel): Promise<UserModel> {
        const registeredAddress: addressField = this.mapper.map(
            model.registeredAddress,
            'AddressModel',
            'addressField',
        );

        const billingAddress: addressField = this.mapper.map(
            model.billingAddress,
            'AddressModel',
            'addressField',
        );

        const contactPerson: contactField = this.mapper.map(
            model.contactPerson,
            'PersonContactModel',
            'contactField',
        );

        const billingPerson: contactField = this.mapper.map(
            model.billingPerson,
            'PersonContactModel',
            'contactField',
        );

        const registeredAddressInserted: addressField =
            await this.prisma.addressField.create({
                data: registeredAddress,
            });

        const billingAddressInserted: addressField =
            await this.prisma.addressField.create({
                data: billingAddress,
            });
        const contactPersonInserted: contactField =
            await this.prisma.contactField.create({ data: contactPerson });
        const billingPersonInserted: contactField =
            await this.prisma.contactField.create({ data: billingPerson });

        let createduser: user = this.mapper.map(
            model,
            'UserModel',
            'user',
        );

        createduser.registeredAddressId = registeredAddressInserted?.id;
        createduser.billingAddressId = billingAddressInserted?.id;
        createduser.contactPersonId = contactPersonInserted?.id;
        createduser.billingPersonId = billingPersonInserted?.id;
        createduser.createdDate = new Date();
        const userInsertd = await this.prisma.user.create({
            data: createduser,
        });

        model.id = userInsertd?.id;
        return model;
    }

    async updateAsync(id: number, model: UserModel): Promise<UserModel | Error> {
        var exists = await this.prisma.user.findFirst({
            where: { id: Number(id), isDeleted: false },
        });
        if (exists) {
            var newUpdate: user = this.mapper.map(
                model,
                'UserModel',
                'user',
            );
            newUpdate.id = exists.id;
            newUpdate.updatedDate = new Date();
            if (model.registeredAddress) {
                const registeredAddress: addressField = this.mapper.map(
                    model.registeredAddress,
                    'AddressModel',
                    'addressField',
                );
                registeredAddress.id = exists.registeredAddressId;
                await this.prisma.addressField.update({
                    where: { id: Number(exists.registeredAddressId) },
                    data: registeredAddress,
                });
            }
            if (model.billingAddress) {
                const billingAddress: addressField = this.mapper.map(
                    model.billingAddress,
                    'AddressModel',
                    'addressField',
                );
                billingAddress.id = exists.billingAddressId;
                await this.prisma.addressField.update({
                    where: { id: Number(exists.billingAddressId) },
                    data: billingAddress,
                });
            }
            if (model.contactPerson) {
                const contactPerson: contactField = this.mapper.map(
                    model.contactPerson,
                    'PersonContactModel',
                    'contactField',
                );
                contactPerson.id = exists.contactPersonId;
                await this.prisma.contactField.update({
                    where: {
                        id: Number(exists.contactPersonId),
                    },
                    data: contactPerson,
                });
            }
            if (model.billingPerson) {
                const billingPerson: contactField = this.mapper.map(
                    model.billingPerson,
                    'PersonContactModel',
                    'contactField',
                );
                billingPerson.id = exists.billingPersonId;
                await this.prisma.contactField.update({
                    where: {
                        id: Number(exists.billingPersonId),
                    },
                    data: billingPerson,
                });
            }

            await this.prisma.user.update({
                where: { id: Number(id) },
                data: newUpdate,
            });
            return model;
        }
        return new Error("Not found");
    }

    async deleteAsync(id: number): Promise<boolean | Error> {
        try {
            await this.prisma.user.update({
                where: { id: Number(id) },
                data: {
                    isDeleted: true,
                    updatedDate: new Date(),
                },
            });

            return true;
        } catch (e) {
            return new Error(e);
        }
    }
}
