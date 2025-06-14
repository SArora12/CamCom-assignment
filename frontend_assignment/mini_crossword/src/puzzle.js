export const puzzle = {
  rows: 8,
  cols: 7,
  grid: [
    // Row 0 (index 0)
    [
      { number: 1, solution: "N" }, // 1 Across, 1 Down
      { solution: "I" }, // 1 Across, 2 Down
      { solution: "H" }, // 1 Across, 3 Down
      { isBlack: true },
      { number: 4, solution: "W" }, // 4 Across, 4 Down
      { number: 5, solution: "W" }, // 4 Across, 5 Down
      { number: 6, solution: "I" }, // 4 Across, 6 Down
      // { isBlack: true },
    ],
    // Row 1 (index 1)
    [
      { number: 7, solution: "B" }, // 7 Across, 7 Down
      { solution: "R" }, // 7 Across, 8 Down
      { solution: "A" }, // 7 Across, 9 Down
      { isBlack: true },
      { number: 8, solution: "H" }, // 8 Across, 10 Down
      { solution: "A" }, // 8 Across, 11 Down
      { solution: "N" }, // 8 Across, 12 Down
      // { isBlack: true },
    ],
    // Row 2 (index 2)
    [
      { number: 9, solution: "C" }, // 9 Across, 13 Down
      { solution: "O" }, // 9 Across, 14 Down
      { solution: "N" }, // 9 Across, 15 Down
      { number: 10, solution: "F" }, // 9 Across, 16 Down
      { solution: "I" }, // 9 Across, 17 Down
      { solution: "R" }, // 9 Across, 18 Down
      { solution: "M" }, // 9 Across, 19 Down
      // { isBlack: true },
    ],
    // Row 3 (index 3)
    [
      { isBlack: true },
      { number: 11, solution: "Q" }, // 10 Across, 20 Down
      { solution: "U" }, // 10 Across, 21 Down
      { solution: "I" }, // 10 Across, 22 Down
      { solution: "Z" }, // 10 Across, 23 Down
      { solution: "M" }, // 10 Across, 24 Down
      { solution: "E" }, // 10 Across, 25 Down
      // { isBlack: true },
    ],
    // Row 4 (index 4)
    [
      { number: 12, solution: "J" }, // 11 Across, 26 Down
      { solution: "U" }, // 11 Across, 27 Down
      { solution: "K" }, // 11 Across, 28 Down
      { solution: "E" }, // 11 Across, 29 Down
      { solution: "B" }, // 11 Across, 30 Down
      { solution: "O" }, // 11 Across, 31 Down
      { solution: "X" }, // 11 Across, 32 Down
      // { isBlack: true },
    ],
    // Row 5 (index 5)
    [
      { number: 13, solution: "A" }, // 12 Across, 33 Down
      { solution: "O" }, // 12 Across, 34 Down
      { solution: "K" }, // 12 Across, 35 Down
      { isBlack: true },
      { number: 14, solution: "A" }, // 14 Across, 36 Down
      { solution: "V" }, // 14 Across, 37 Down
      { solution: "I" }, // 14 Across, 38 Down
      // { solution: "C" }, // 14 Across, 39 Down
    ],
    // Row 6 (index 6)
    [
      { number: 15, solution: "V" }, // 15 Across, 40 Down
      { solution: "I" }, // 15 Across, 41 Down
      { solution: "A" }, // 15 Across, 42 Down
      { isBlack: true },
      { number: 16, solution: "N" }, // 16 Across, 43 Down
      { solution: "I" }, // 16 Across, 44 Down
      { solution: "C" }, // 16 Across, 45 Down
      // { isBlack: true },
    ],
    [
      { number: 17, solution: "A" }, // 15 Across, 40 Down
      { solution: "S" }, // 15 Across, 41 Down
      { solution: "H" }, // 15 Across, 42 Down
      { isBlack: true },
      { number: 18, solution: "G" }, // 16 Across, 43 Down
      { solution: "E" }, // 16 Across, 44 Down
      { solution: "O" }, // 16 Across, 45 Down
      // { isBlack: true },
    ],
  ],
  across: [
    {
      number: 1,
      clue: "Research org. that once employed Dr. Fauci",
      answer: "NIH",
    },
    {
      number: 4,
      clue: "Conflict ended on 11/11/1918, for short",
      answer: "WWI",
    },
    { number: 7, clue: "Garment with an underwire", answer: "BRA" },
    { number: 8, clue: "___ Solo of 'Star Wars'", answer: "HAN" },
    { number: 9, clue: "Verify the truth of", answer: "CONFIRM" },
    {
      number: 11,
      clue: "Student's request while preparing for a test",
      answer: "QUIZME",
    },
    {
      number: 12,
      clue: "Music player at a '50s-style diner",
      answer: "JUKEBOX",
    },
    { number: 13, clue: '"All good to go!"', answer: "AOK" },
    { number: 14, clue: "Prefix meaning 'bird' or 'flight'", answer: "AVI" },
    { number: 15, clue: "By way of", answer: "VIA" },
    { number: 16, clue: "Actor Cage,to fans", answer: "NIC" },
    { number: 17, clue: "Flecks from a campfire", answer: "ASH" },
    { number: 18, clue: "Nat ___ (TV channel)", answer: "GEO" },
  ],
  down: [
    { number: 1, clue: '"Saturday Night Live" network', answer: "NBC" },
    {
      number: 2,
      clue: "The Haudenosaunee Confederacy, by another name",
      answer: "IROQUOIS",
    },
    { number: 3, clue: "Eight-day Jewish holiday", answer: "HANUKKAH" },
    {
      number: 4,
      clue: "Sensationally successful, in older slang",
      answer: "WHIZBANG",
    },
    {
      number: 5,
      clue: '"Full Metal Jacket" or "Saving Private Ryan"',
      answer: "WARMOVIE",
    },
    {
      number: 6,
      clue: "Where Baja California is, as opposed to California",
      answer: "INMEXICO",
    },
    { number: 10, clue: "Fee, ___, foe, fum", answer: "FIE" },
    {
      number: 12,
      clue: "Coding language with a coffee cup logo",
      answer: "JAVA",
    },
  ],
};
