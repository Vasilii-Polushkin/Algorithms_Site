import { attribute, attributeTypes } from "./utilities/condition";

// таблица, где первая строка с названиями колонок
export let dataTable: string[][] = [];

// все возможные условия в нодах
export let intervalAttributesList: attribute[];
export let categoricalAttributesList: attribute[];

function sortUnique(arr: any) {
    if (arr.length === 0) return arr;
    arr = arr.sort();
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
      if (arr[i-1] !== arr[i])
        ret.push(arr[i]);
    }
    return ret;
  }

function adjustMedians(arr: any){
    let res:any[] = [];
    for (let i = 0; i < arr.length - 1; ++i)
        res.push((arr[i] + arr[i + 1]) / 2);
    return res;
}

//обрабатываем каждый столбец(атрибут) поочередно
//сначала определяем тип атрибута
//потом преобразуем столб в сет и находим всевозможные условия, которые могут быть в узлах дерева
export function getAttributesLists()
{
    let newIntervalAttributesList: attribute[] = [];
    let newCategoricalAttributesList: attribute[] = [];

    const columLength = dataTable.length;
    const rowLength = dataTable[0].length;

    for (let columID = 0; columID< columLength - 1; ++columID)
    {
        let attribuleType = attributeTypes.INTERVAL;
        let colum:any[] = [];

        for (let rowID = 1; rowID < rowLength; ++rowID)
            colum.push(dataTable[rowID][columID]);

        sortUnique(colum);

        // deducing colum(attribute) type
        if (colum.length <= 10)
            attribuleType = attributeTypes.CATEGORICAL;

        else
        {
            for (let rowID = 1; rowID < rowLength; ++rowID)
            {
                let floatNum = parseFloat(colum[rowID]);
            
                if (isNaN(floatNum))
                {
                    attribuleType = attributeTypes.CATEGORICAL;
                    break;
                }
            }
        }

        if (attribuleType == attributeTypes.CATEGORICAL)
        {
            newCategoricalAttributesList.push(new attribute
                (parseFloat(dataTable[0][columID]), colum, false)
            );
        }
        else
        {
            adjustMedians(colum);
            let usedArr:boolean[] = [];
            usedArr.length = colum.length;
            usedArr.fill(false);

            newIntervalAttributesList.push(new attribute
                (parseFloat(dataTable[0][columID]), colum, usedArr)
            );
        }
    }

    return [newIntervalAttributesList, categoricalAttributesList];
}