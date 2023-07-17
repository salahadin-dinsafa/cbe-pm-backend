import {
    BadRequestException,
    ConflictException, Injectable,
    NotFoundException, UnprocessableEntityException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DistrictEntity } from './entities/district.entity';
import { IAddDistrict } from './types/add-district.interface';
import { IPagination } from './types/pagination.interface';

@Injectable()
export class DistrictService {
    constructor(
        @InjectRepository(DistrictEntity)
        private readonly districtRepository: Repository<DistrictEntity>
    ) { }

    async findDistrictById(id: string): Promise<DistrictEntity> {
        try {
            return await this.districtRepository.findOne({ where: { id } });
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async findDistrictByName(name: string): Promise<DistrictEntity> {
        try {
            return await this.districtRepository.findOne({ where: { name } });
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async addDistrict(addDistrict: IAddDistrict): Promise<DistrictEntity> {
        let district: DistrictEntity = await this.findDistrictByName(addDistrict.name);
        if (district) throw new ConflictException(`${addDistrict.name} already exists`);

        try {
            return await this.districtRepository.save({ ...addDistrict })
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async updateDistrict(districtId: string, updateDistrict: IAddDistrict): Promise<DistrictEntity> {
        let district: DistrictEntity =
            await this.districtRepository.findOne({ where: { id: districtId } });
        if (!district)
            throw new NotFoundException(
                `District with #name: ${updateDistrict.name} not found`
            );
        try {
            district.name = updateDistrict.name;
            return await district.save();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async deleteDistrict(id: string): Promise<DistrictEntity> {
        let district: DistrictEntity = await this.findDistrictById(id);
        if (!district) throw new NotFoundException(`District with id ${id} not found`);

        try {
            district.manager = null;
            await district.save();
            return await district.remove();
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2')
                throw new BadRequestException(`Error: District have members you can't delete`);

            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async findAllDistrict(pagination: IPagination): Promise<DistrictEntity[]> {
        try {
            return await this.districtRepository.find({ take: pagination.limit, skip: pagination.offset })
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }

    async findDistrict(id: string): Promise<DistrictEntity> {
        let district: DistrictEntity = await this.findDistrictById(id);
        if (!district) throw new NotFoundException(`District with #id:${id} not found`)

        return district;
    }
}
