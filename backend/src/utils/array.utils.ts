export const randomSelection = <T>(n: number, array: T[]) => {
  let newArr: T[] = [];
  if (n >= array.length) {
    return array;
  }

  for (let i = 0; i < n; i++) {
    let newElem = array[Math.floor(Math.random() * array.length)];
    while (newArr.includes(newElem)) {
      newElem = array[Math.floor(Math.random() * array.length)];
    }
    newArr.push(newElem);
  }

  return newArr;
};
