import React from "react";
import "./previousGuessDisplay.css";

interface PreviousGuessDisplayProps {
    guess: string;
    wordLength: number;
    correctWord: string;
}

const PreviousGuessDisplay: React.FC<PreviousGuessDisplayProps> = ({ guess, wordLength, correctWord }) => {
    const correct = correctWord.toUpperCase();

    const getLetterStatus = (letter: string, index: number, correct: string) => {
        if (letter === correct[index]) {
            return 'correct';
        } else if (correct.includes(letter)) {
            return 'present';
        } else {
            return 'absent';
        }
    };

    return (
        <div className="previous-guess">
            {guess.split('').map((letter, index) => {
                const status = getLetterStatus(letter, index, correct);
                const statusClass = `previous-guess__letter--${status}`;
                return (
                    <div
                        key={index}
                        className={`previous-guess__letter ${statusClass}`}
                    >
                        {letter}
                    </div>
                );
            })}
        </div>
    );
};

export default PreviousGuessDisplay;
