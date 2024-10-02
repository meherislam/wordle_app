import React from "react";
import './keyboard.css';
import useWordleGameStore from '../../store/useWordleGameStore';

const Keyboard: React.FC = () => {
    const { games, currentGameId } = useWordleGameStore();
    const currentGame = games.find((game) => game.id === currentGameId);

    if (!currentGame) return null;

    const firstRow: string[] = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    const secondRow: string[] = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const thirdRow: string[] = ["Z", "X", "C", "V", "B", "N", "M"];

    const getKeyClass = (key: string) => {
        const status = currentGame.guessedLetters[key.toUpperCase()];
        switch (status) {
            case "correct":
                return "key correct";
            case "present":
                return "key present";
            case "absent":
                return "key absent";
            default:
                return "key";
        }
    };

    return (
        <div className="keyboard">
            <div className="keyboard-row">
                {firstRow.map((key) => (
                    <button key={key} className={getKeyClass(key)}>
                        {key}
                    </button>
                ))}
            </div>
            <div className="keyboard-row">
                {secondRow.map((key) => (
                    <button key={key}  className={getKeyClass(key)}>
                        {key}
                    </button>
                ))}
            </div>
            <div className="keyboard-row">
                {thirdRow.map((key) => (
                    <button key={key} className={getKeyClass(key)}>
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Keyboard;
