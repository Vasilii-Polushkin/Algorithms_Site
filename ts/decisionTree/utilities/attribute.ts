export enum attributeTypes
{
    CATEGORICAL,
    INTERVAL
}
export class attribute
{
    constructor(attributeID: number, valuesI: number[] | string[], GlobalIDI: number)
    {
        this.GlobalID = GlobalIDI;
        this.id = attributeID;
        this.values = valuesI;
    }
    GlobalID: number; 
    id: number;
    values: number[] | string[];
}
