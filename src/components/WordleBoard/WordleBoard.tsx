import React, { useEffect } from "react";
import WordInput from "../WordInput/WordInput";
import useWordleGameStore from "../../store/useWordleGameStore";
import PreviousGuessDisplay from "../PreviousGuessDisplay/previousGuessDisplay";
import Keyboard from "../Keyboard/keyboard";
import './WordleBoard.css';

const WordleBoard: React.FC = () => {
    const {
        games,
        currentGameId,
        updateCurrentGuess,
        submitGuess,
    } = useWordleGameStore();

    const currentGame = games.find((game) => game.id === currentGameId);

    useEffect(() => {
        if (currentGame?.currentGuess.every(guess => guess === '')) {
            console.log('currentGuess reset');
        }
    }, [currentGame?.currentGuess]);

    if (!currentGame || !currentGame.currentGuess) {
        return <div>No Active Games!</div>;
    }


    const handleLetterChange = (letter: string, index: number) => {
        const newGuess = [...currentGame.currentGuess];
        newGuess[index] = letter;
        updateCurrentGuess(currentGame.id, newGuess);
    };

    async function validateWordExists(word: string): Promise<boolean> {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return Array.isArray(data) && data.length > 0;
        } catch (error) {
            console.error('Error fetching word data:', error);
            return false;
        }
    }

    function isPlural(word: string): boolean {
        const wordLowerCased = word.toLowerCase();
        return wordLowerCased.endsWith('ies') || wordLowerCased.endsWith('es') ||
            (wordLowerCased.endsWith('s') && !wordLowerCased.endsWith('ss'));
    }

    const handleSubmit = async () => {
        if (!currentGame) return;

        const currentGuessString = currentGame.currentGuess.join('').toUpperCase();

        if (currentGuessString.length !== currentGame.wordLength) {
            alert(`The word must be exactly ${currentGame.wordLength} letters.`);
            return;
        }

        if (currentGame.hardMode) {
            for (const [index, letter] of Object.entries(currentGame.correctLetterPositions)) {
                if (currentGame.currentGuess[Number(index)] !== letter) {
                    alert(`In Hard Mode, the letter "${letter}" must remain in position ${Number(index) + 1}`);
                    return;
                }
            }
        }

        const wordExists = await validateWordExists(currentGuessString);
        if (!wordExists) {
            alert("The word does not exist. Please try again.");
            return;
        }

        const isWordPlural = isPlural(currentGuessString);
        if (isWordPlural) {
            alert("Plural words are not allowed. Please use the singular form.");
            return;
        }

        submitGuess(currentGame.id, currentGuessString);

        if (currentGuessString === currentGame.correctWord) {
            alert("Congratulations! You guessed the correct word!");
        } else if (currentGame.guesses.length + 1 >= currentGame.maxAttempts) {
            alert("You've run out of guesses! The correct word was: " + currentGame.correctWord);
        }
    };

    const maxAttempts = currentGame.maxAttempts;

    return (
        <div className="wordleBoardLayout">
            {/* Display all previous guesses */}
            {currentGame.guesses.map((guess, index) => (
                <PreviousGuessDisplay
                    key={index}
                    guess={guess}
                    wordLength={currentGame.wordLength}
                    correctWord={currentGame.correctWord}
                />
            ))}

            {/* Render current guess input if game is not over */}
            {!currentGame.isGameOver && currentGame.guesses.length < maxAttempts && (
                <WordInput
                    key={currentGame.guesses.length}
                    currentGuess={currentGame.currentGuess}
                    onLetterChange={handleLetterChange}
                    onSubmitGuess={handleSubmit}
                />
            )}


            {Array.from({length: maxAttempts - currentGame.guesses.length - (!currentGame.isGameOver ? 1 : 0)}, (_, index) => (
                <WordInput
                    key={index + currentGame.guesses.length + 1}
                    currentGuess={Array(currentGame.wordLength).fill('')}
                    onLetterChange={() => {
                    }}
                    onSubmitGuess={() => {
                    }}
                    disabled={true}
                />
            ))}

            <div className="keyboardWrapper">
                <Keyboard/>
            </div>
        </div>
    );
};

export default WordleBoard;
