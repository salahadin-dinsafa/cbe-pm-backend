import {
    ConflictException, Injectable, NotFoundException,
    UnauthorizedException, UnprocessableEntityException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TwilioService } from "nestjs-twilio";


import { PerformanceEntity } from "../entities/performance.entity";
import { ITerminalID } from "../types/terminal-id.interface";
import { UserEntity } from "../../auth/entities/user.entity";
import { ROLES } from "../../common/types/roles.enum";
import { DistrictEntity } from "../../district/entities/district.entity";
import { IPerformances, IPerformance } from "../types/performance.interface";
import { AuthService } from "../../auth/auth.service";
import { IPerformancePagination } from "../types/performance-pagination.interface";

@Injectable()
export class PerformanceService {
    constructor(
        @InjectRepository(PerformanceEntity)
        private readonly performanceRepository: Repository<PerformanceEntity>,
        private readonly authService: AuthService,
        private readonly twilioService: TwilioService,
        private readonly dataSource: DataSource
    ) { }

    districtTerminalID = {
        'DEBRE MARKOS': 'ADM',
        'DESSIE': 'ADE',
        'DIRE DAWA': 'ADD',
        'GONDAR': 'AGD',
        'JIJIGA': 'AJJ',
        'WOLDIA': 'AWL',
        'BAHIRDAR': 'ABD',
        'DEBRE BERHAN': 'ABD',
    }



    async findPerformanceWithDate(date: Date, validTerminalID: string): Promise<PerformanceEntity[]> {
        let performances: PerformanceEntity[];

        try {
            performances = await
                this.performanceRepository
                    .find({ where: { date } })
                    .then(performances => performances.filter(
                        performance => performance.terminalID.startsWith(validTerminalID)))
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
        if (performances.length > 0)
            throw new ConflictException(`Already added`)
        return performances;
    }

    async findById(terminalID: ITerminalID): Promise<PerformanceEntity[]> {
        const currentDate: Date = new Date();
        const lastMonth: Date = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
        try {
            let performances =
                await this.performanceRepository.find({ where: { terminalID: terminalID.terminalID } })
            performances = performances.filter(performance => performance.date > lastMonth);
            return performances;
        } catch (err) {
            throw new UnprocessableEntityException(`Error: ${err}`)
        }
    }

    async findMany(performancePagination: IPerformancePagination): Promise<PerformanceEntity[]> {
        const { terminalID, district, date } = performancePagination;


        const queryBuilder =
            this.dataSource
                .getRepository(PerformanceEntity)
                .createQueryBuilder('performance');
        try {

            terminalID ?
                queryBuilder.andWhere('performance.terminalID = :terminalID', { terminalID }) :
                null;
            date ?
                queryBuilder.andWhere('performance.date = :date', { date: new Date(date) }) :
                null;

            let performances = await queryBuilder.getMany();

            performances = performances
                .filter(performance => performance.terminalID.startsWith(this.districtTerminalID[district]))

            return performances;
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`);
        }
    }

    async addPerformance(user: UserEntity, performancesType: IPerformances) {


        const mgOrIS: UserEntity = await this.authService.findUserByPhone(
            this.authService.modifyPhone(user.phoneNumber)
        )
        if (!mgOrIS) throw new UnauthorizedException('user not authorized');
        const { date, performances } = performancesType;

        let district: DistrictEntity =
            mgOrIS.role === ROLES.DISTRICT_IS_MG ? mgOrIS.managerDistrict :
                mgOrIS.district;

        const validTerminalID = this.districtTerminalID[`${district.name}`]

        await this.findPerformanceWithDate(new Date(date), validTerminalID)

        performances.map(async performance => {
            if (performance.terminalID.toUpperCase().startsWith(validTerminalID))
                await this.addPerformanceToDb(performance)
        })


        try {
            let averagePerformance: string;
            performancesType.average.map(average => {
                if (average.terminalID.startsWith(validTerminalID))
                    averagePerformance = `${average.inService}%`;
            })

            const response = await this.twilioService
                .client
                .messages
                .create({
                    from: process.env.TWILIO_PHONENUMBER,
                    to: "+251933303700",
                    body: `day: ${performancesType.date} performance: ${averagePerformance}`

                })
            console.log('Response', response);



        } catch (error) {
            throw new UnprocessableEntityException(`We have found error on message service please cheack your network connection!`)

        }

        // Todo: send it to operators and managers and Is

    }

    async addPerformanceToDb(performanceType: IPerformance) {
        try {
            const performance: PerformanceEntity =
                this.performanceRepository.create({
                    terminalID: performanceType.terminalID,
                    date: performanceType.date,
                    name: performanceType.name,
                    inService: performanceType.inService
                });
            await performance.save();
        } catch (error) {
            throw new UnprocessableEntityException(`Error: ${error}`)
        }
    }
}