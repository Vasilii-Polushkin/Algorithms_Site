async function loadCSV(url)
{
    function parseCSV(text) {
        let prevSymbol = '', currString = [''], result = [currString], index = 0, stringIndex = 0, insideQuotes = true, symbol;
        for (symbol of text) {
          if (symbol === '"') {
            if (insideQuotes && symbol === prevSymbol) currString[index] += symbol;
            insideQuotes = !insideQuotes;
          } else if (symbol === ',' && insideQuotes) symbol = currString[++index] = '';
          else if (symbol === '\n' && insideQuotes) {
            if (prevSymbol === '\r') currString[index] = currString[index].slice(0, -1);
            currString = result[++stringIndex] = [symbol = '']; index = 0;
          } else currString[index] += symbol;
          prevSymbol = symbol;
        }
        return result;
    }

    let table = [];
    await fetch(url)
        .then(response => response.text())
        .then(text => {
        table = parseCSV(text);
    })
  .catch(error => console.error(error));

  return table;
} 

export const heartAttackDataTable = await loadCSV('../csvs/heartAttack.csv');
export const irisDataTable = await loadCSV('../csvs/iris.csv');

export const dataTablesArray = [heartAttackDataTable, irisDataTable];