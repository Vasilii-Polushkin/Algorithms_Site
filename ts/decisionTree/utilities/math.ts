export const maxEnthropy = 9999;

export function xLog2x(x: number):number
{
    return x <= 0? 0 : x * Math.log2(x);
}

export function calcEnthrophy(probabilities: number[]): number
{
    let entropy = 0;

    for (let i = 0; i < probabilities.length; ++i)
        entropy -= xLog2x(probabilities[i]);

    return entropy;
}

export function sortUnique(arr: any) {
    if (arr.length === 0) return arr;
    arr = arr.sort();
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
      if (arr[i-1] !== arr[i])
        ret.push(arr[i]);
    }
    return ret;
}

export function adjustMedians(arr: any){ 
    let res:any[] = [];
    for (let i = 0; i < arr.length - 1; ++i)
        res.push((arr[i] + arr[i + 1]) / 2);
    return res;
}

export function incrementedValue(x: undefined | number): number
{
    if (x == undefined)
        x = 0;
    x++;
    return x;
} 