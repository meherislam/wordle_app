import React, { useRef } from "react";
import './WordInput.css';

interface WordInputProps {
    currentGuess: string[];
    onLetterChange: (letter: string, index: number) => void;
    onSubmitGuess: () => void;
    disabled?: boolean;
}

const WordInput: React.FC<WordInputProps> = ({ currentGuess, onLetterChange, onSubmitGuess, disabled }) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;

        if (/^[a-zA-Z]?$/.test(value)) {
            onLetterChange(value.toUpperCase(), index);

            if (value && index < currentGuess.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            onSubmitGuess();
        }

        if (e.key === 'Backspace' && index > 0 && !currentGuess[index]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className={"word-input"}>
            {currentGuess.map((letter, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className={"letter-input"}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default WordInput;
