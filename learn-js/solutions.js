export const rectPerimeter = (x, y) => 2 * (x + y);
export const rectArea = (x, y) => x * y;
export const triArea = (x, y) => (1 / 2) * x * y;
export const ringArea = (x, y) => {
  const outer = Math.max(x, y);
  const inner = Math.min(x, y);
  return Math.PI * (outer ** 2 - inner ** 2);
}
export const f2c = (x) => (x - 32) * (5 / 9);
export const c2f = (x) => (x * (9 / 5)) + 32;
export const makeName = (first, last) => {
  return `${last}, ${first}`;
}
export const ellide = (string, N) => {
  const newString = string.slice(0, N) + '...';
  return newString;
}
export const longer = (string1, string2) => {
  if (string1.length > string2.length) {
    return string1
  }
  else
    return string2
}
export const mid3 = (N1, N2, N3) => {
  return N2
}
export const lastFirst = ({ first, last }) => {
  if (first && last) {
    return `${last}, ${first}`;
  } else if (last) {
    return `${last}`
  } else if (first) {
    return `${first}`
  } else {
    return ''
  }
}
export const subArray = (array, indices) => {
  const result = [];
  for (let i = 0; i < indices.length; i++) {
    result.push(array[indices[i]]);
  }
  return result;
}
export const over21 = (people) => {
  return people.filter((person) => {
    return person.age >= 21;
  });
}
export const product = (numbers) => {
  let result = 1;
  for (let i = 0; i < numbers.length; i++) {
    result *= numbers[i];
  }
  return result;
}
export const getRepeats = (items) => {
  const counts = {};
  const result = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (counts[item]) {
      counts[item] += 1;
    } else {
      counts[item] = 1;
    }
    if (counts[item] === 2) {
      result.push(item);
    }
  }
  return result;
}
export const aboveAverage = (exams) => {
  const average = exams.reduce((sum, exam) => sum + exam.score, 0) / exams.length;
  return exams.filter(exam => exam.score > average);
};
export const reverseNumber = (number) => {
  const numberString = number.toString();
  const stringArray = numberString.split("");
  const newStringArray = stringArray.reverse().join("");
  const newNumberString = Number(newStringArray);
  return newNumberString;
}
export const isWordAnagram = (wordOne, wordTwo) => {
  const newWordOne = wordOne.toLowerCase().split("").sort().join("");
  const newWordTwo = wordTwo.toLowerCase().split("").sort().join("");
  if (newWordOne === newWordTwo) {
    return true
  } else {
    return false
  }
}
export const isPhraseAnagram = (phraseOne, phraseTwo) => {
  const newPhraseOne = phraseOne.toLowerCase().replace(/ /g, "").split("").sort().join("");
  const newPhraseTwo = phraseTwo.toLowerCase().replace(/ /g, "").split("").sort().join("");
  if (newPhraseOne === newPhraseTwo) {
    return true
  } else {
    return false
  }
}
export const longestWords = (phrase) => {
  const phraseArray = phrase.split(" ");
  let longestArray = [];
  let maxLength = 0;
  for (let i = 0; i < phraseArray.length; i++) {
    if (phraseArray[i].length > maxLength) {
      maxLength = phraseArray[i].length;
      longestArray = [];
      longestArray.push(phraseArray[i]);
    } else if (phraseArray[i].length === maxLength) {
      longestArray.push(phraseArray[i]);
    }
  }
  return longestArray;
}
export const moduleTitles = () => {
  let elements = Array.from(document.querySelectorAll(".module-title")).map(h => h.innerText);
  return elements;
}
export const goPurple = () => {
  let elements = Array.from(document.querySelectorAll(".exercise-name"));
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.color = "white";
    elements[i].style.backgroundColor = "purple";
  }
  return 'Go Purple!';
}
