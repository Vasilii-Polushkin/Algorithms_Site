export enum attributeTypes
{
    CATEGORICAL,
    INTERVAL
}
export class attribute
{
    constructor(attributeID: number, valuesI: number[], usedI: boolean | boolean[])
    {
        this.id = attributeID;
        this.values = valuesI;
        this.used = usedI;
    }
    id: number;
    values: number[];
    //either bool for categorical or bool[] for interval
    used: boolean | boolean[];
}
