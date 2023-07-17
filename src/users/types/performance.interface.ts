import { ITerminalID } from "./terminal-id.interface";

export interface IPerformance extends ITerminalID {
    inService: number;
    name: string;
    date: string;
}

export interface IAverage extends ITerminalID {
    inService: number;
}

export interface IPerformances {
    date: string;
    performances: IPerformance[];
    average: IAverage[];
}