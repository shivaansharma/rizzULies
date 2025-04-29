export function Generate_random_numbers({values}:{values:number[]}){
    for(let i = 1;i<340;i++){
        values[i]=Math.floor((Math.random() * 700) + 1);
    }
    
}

export function partition({ low, high, values,swaps}: { low: number, high: number, values: number[] ,swaps:number[][]}): number {
    let i = low - 1;
    let pivot = values[high]; 
    let j = high;

    while (true) {
       
        while (values[++i] < pivot) {}

        while (values[--j] > pivot && j > low) {}

       
        if (i >= j) break;

       
        [values[i], values[j]] = [values[j], values[i]];
        swaps.push([j, i]); 
    }

  
    [values[i], values[high]] = [values[high], values[i]];
    swaps.push([high, i]);

    return i; 
}
export function Merge(
    low: number,
    mid: number,
    high: number,
    values: number[],
    swaps: number[][]
) {
    let left = values.slice(low, mid + 1);
    let right = values.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            values[k] = left[i];
            swaps.push([k, left[i]]);
            i++;
        } else {
            values[k] = right[j];
            swaps.push([k, right[j]]);
            j++;
        }
        k++;
    }

    while (i < left.length) {
        values[k] = left[i];
        swaps.push([k, left[i]]);
        i++; k++;
    }

    while (j < right.length) {
        values[k] = right[j];
        swaps.push([k, right[j]]);
        j++; k++;
    }
}