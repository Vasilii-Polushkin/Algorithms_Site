export enum attributeTypes
{
    CATEGORICAL,
    INTERVAL
}
export class attribute
{
    constructor(attributeID, valuesI, usedI)
    {
        this.id = attributeID;
        this.values = valuesI;
        this.used = usedI;
    }
    //attributeType: attributeTypes;
    id: number;
    values: number[];
    //either bool for categorical or bool[] for interval
    used: boolean | boolean[];
}
