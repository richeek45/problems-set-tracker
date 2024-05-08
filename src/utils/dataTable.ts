import { Row } from "@tanstack/react-table";
import { ProblemRow } from "~/components/DataTableContent";


const levenshteinEditDistance = (searchTerm: string, word: string) => {
  // edit distance from searchTerm to title -> kitten -> sitten
  // initialize 2D matrix to null -> every row is single string -> title, and every column is single string -> searchTerm
  const distanceMatrix = Array(word.length + 1).fill(null).map(() => Array(searchTerm.length + 1).fill(null));
  const titleLength = word.length;
  const searchTermLength = searchTerm.length;

    // index starts from 1 for each character and comparison starts from 0

  // base case for pre-filling the edit distance with 0th index of searchTerm 
  for (let i = 0; i <= titleLength; i++) {
    distanceMatrix[i][0] = i;
  }

  // base case for pre-filling the edit distance with 0th index of title 
  for (let j = 0; j <= searchTermLength; j++) {
    distanceMatrix[0][j] = j;
  }

  // i stands for char in title, j stands for char in searchTerm
  // we are trying to convert j to i by comparing ith character of searchTerm to jth character of title
  // in the 2d distanceMatrix[i][j] distanceMatrix[j][i] represents the minimum number of operations 
  // (deletions, insertions, and substitutions) 
  // required to convert the substring searchTerm up to index i into the substring a up to index i.
  for (let i = 1; i <= titleLength; i++) {
    for (let j = 1; j <= searchTermLength; j++) {
      // to check if substitution is required at i and j
      const substitutionCost = word[i - 1] === searchTerm[j -1] ? 0 : 1; 
      distanceMatrix[i][j] = Math.min(
          distanceMatrix[i][j - 1] + 1,  // insertion -> i has one extra character missing in j
          distanceMatrix[i - 1][j]  + 1,  // deletion -> j has one extra character needed to be removed  
          distanceMatrix[i - 1][j - 1] + substitutionCost 
          // substitution -> whatever the edit distance is calculated at [i-1][j-1] + current substitution cost
      )
    }
  }

  return distanceMatrix[titleLength][searchTermLength];

}

export const filterTitle =  (row: Row<ProblemRow>, columnId: string, filterValue: string) => {
  const words = row.original.url.title.toLowerCase().trim();
  const filteredTerm = filterValue.toLowerCase().trim();
  const threshold = 2;

  // compare the title with the search query and check if it has a score < 3
  const editDistance = levenshteinEditDistance(words.substring(0, filteredTerm.length), filteredTerm);
  const match = editDistance <= threshold || words.includes(filteredTerm);


  return match ? true : false;
}