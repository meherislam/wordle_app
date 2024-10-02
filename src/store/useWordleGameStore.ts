import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface Game {
    id: string;
    wordLength: number;
    hardMode: boolean;
    currentGuess: string[];
    guesses: string[];
    correctWord: string;
    isGameOver: boolean;
    maxAttempts: number;
    guessedLetters: { [key: string]: 'correct' | 'present' | 'absent' | undefined };
    correctLetterPositions: { [index: number]: string };
}

interface WordleGameStore {
    games: Game[];
    currentGameId: string | null;
    switchGame: (gameId: string) => void;
    createGame: (numberOfLetters: number, hardMode: boolean, correctWord: string) => void;
    updateCurrentGuess: (gameId: string, newGuess: string[]) => void;
    submitGuess: (gameId: string, word: string) => void;
}

const useWordleGameStore = create<WordleGameStore>()(
    devtools(
        persist(
            (set, get) => ({
                games: [],
                currentGameId: null,

                switchGame: (gameId: string) => {
                    set({ currentGameId: gameId });
                },

                createGame: (numberOfLetters: number, hardMode: boolean, correctWord: string) => {
                    const newGame: Game = {
                        id: uuidv4(),
                        wordLength: numberOfLetters,
                        hardMode: hardMode,
                        currentGuess: Array(numberOfLetters).fill(''),
                        guesses: [],
                        correctWord: correctWord,
                        isGameOver: false,
                        maxAttempts: numberOfLetters + 1,
                        guessedLetters: {},
                        correctLetterPositions: {},
                    };
                    set((state) => ({
                        games: [...state.games, newGame],
                        currentGameId: newGame.id,
                    }));
                },

                updateCurrentGuess: (gameId: string, newGuess: string[]) => {
                    set((state) => ({
                        games: state.games.map((game) =>
                            game.id === gameId
                                ? { ...game, currentGuess: newGuess }
                                : game
                        ),
                    }));
                },

                submitGuess: (gameId: string, word: string) => {
                    set((state) => {
                        const updatedGames = state.games.map((game) => {
                            if (game.id !== gameId) return game;

                            const isCorrectGuess = word.toUpperCase() === game.correctWord.toUpperCase();
                            const correctWord = game.correctWord.toUpperCase().split('');
                            const guessedWord = word.toUpperCase().split('');
                            const newGuessedLetters = { ...game.guessedLetters };
                            const newCorrectLetterPositions = { ...game.correctLetterPositions };

                            guessedWord.forEach((letter, index) => {
                                if (letter === correctWord[index]) {
                                    newGuessedLetters[letter] = 'correct';
                                    newCorrectLetterPositions[index] = letter;
                                } else if (correctWord.includes(letter)) {

                                    if (newGuessedLetters[letter] !== 'correct') {
                                        newGuessedLetters[letter] = 'present';
                                    }
                                } else {
                                    newGuessedLetters[letter] = 'absent';
                                }
                            });

                            return {
                                ...game,
                                guesses: [...game.guesses, word],
                                currentGuess: Array(game.wordLength).fill(''),
                                isGameOver: isCorrectGuess,
                                guessedLetters: newGuessedLetters,
                                correctLetterPositions: newCorrectLetterPositions,
                            };
                        });

                        return { games: updatedGames };
                    });
                }
            }),
            {
                name: 'wordle-game-store',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);

export default useWordleGameStore;
