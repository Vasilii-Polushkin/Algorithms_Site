export enum attributeTypes
{
    CATEGORICAL,
    INTERVAL
}

export class attribute
{
    attributeType: attributeTypes;
    attributeName: string;
    attributeValue: number;
}