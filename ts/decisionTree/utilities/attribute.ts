export enum attributeTypes
{
    CATEGORICAL,
    INTERVAL
}
export class attribute
{
    constructor(attributeID: number, valuesI: number[] | string[], usedI: boolean | boolean[], GlobalIDI: number)
    {
        this.GlobalID = GlobalIDI;
        this.id = attributeID;
        this.values = valuesI;
        this.used = usedI;
    }
    GlobalID: number;
    id: number;
    values: number[] | string[];
    //either bool for categorical or bool[] for interval
    used: boolean | boolean[];
}
