import React, { useState } from "react";
import "./Headerbar.css";
import useWordleGameStore from "../../store/useWordleGameStore";

const HeaderBar: React.FC = () => {
    const { games, switchGame, createGame } = useWordleGameStore();
    const [isCreateGameVisible, setCreateGameVisible] = useState(false);
    const [isSwitchGameVisible, setSwitchGameVisible] = useState(false);

    const [isHardMode, setIsHardMode] = useState(false);
    const [selectedNumberOfLetters, setSelectedNumberOfLetters] = useState(5);

    const toggleCreateGame = () => setCreateGameVisible(!isCreateGameVisible);
    const toggleSwitchGame = () => setSwitchGameVisible(!isSwitchGameVisible);

    const toggleHardModeSwitch = () => setIsHardMode(!isHardMode);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNumberOfLetters(Number(e.target.value));
    };

    const selectRandomWordByLength = (length: number): string => {
        const wordListByLength: { [key: number]: string[] } = {
            5: ["apple", "peach", "lemon", "mango", "berry", "grape", "melon", "water", "stone", "shark"],
            6: ["banana", "orange", "jungle", "pepper", "planet", "silver", "stream", "cookie", "school", "animal"],
            7: ["concert", "avocado", "popcorn", "machine", "holiday", "picture", "sunrise", "journey", "gateway", "fitness"],
            8: ["broccoli", "elephant", "magazine", "computer", "umbrella", "mountain", "airplane", "notebook", "hospital", "football"]
        };
        const words = wordListByLength[length];
        return words[Math.floor(Math.random() * words.length)];
    };

    const handleCreateGame = () => {
        const randomWord = selectRandomWordByLength(selectedNumberOfLetters);
        createGame(selectedNumberOfLetters, isHardMode, randomWord.toUpperCase());
        toggleCreateGame();
    };

    return (
        <div className="headerBarContainer">
            {/* Create Game Button */}
            <button className="headerButton" onClick={toggleCreateGame}>
                Create Game
            </button>

            {/* Create Game Popup */}
            {isCreateGameVisible && (
                <div className="popupContainer">
                    <div className="popup">
                        <h2 className="popup-header">Create a New Game</h2>
                        <div className="letter-selector">
                            <h3>Number of Letters</h3>
                            <select value={selectedNumberOfLetters} onChange={handleChange} className="custom-select">
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                            </select>
                        </div>
                        <div className="toggle-container">
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    checked={isHardMode}
                                    onChange={toggleHardModeSwitch}
                                    className="toggle-checkbox"
                                />
                                <span className="toggle-switch"></span>
                                Hard Mode
                            </label>
                        </div>
                        <button onClick={handleCreateGame} className="popup-button">Create Game</button>
                        <button className="closeButton" onClick={toggleCreateGame}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Switch Game Button */}
            <button className="headerButton" onClick={toggleSwitchGame}>
                Switch Game
            </button>

            {/* Switch Game Popup */}
            {isSwitchGameVisible && (
                <div className="popupContainer">
                    <div className="popup">
                        <h2 className="popup-header">Switch Game</h2>
                        <ul className="gameList">
                            {games.map((game) => (
                                <li key={game.id} className="listItem">
                                    <li className="gameInfo">
                                        <span className="gameId">Game ID: {game.id}</span>

                                    </li>
                                    <li>
                                        <span className="letters">Number Of Letters: {game.wordLength}</span>
                                    </li>
                                    <li>
                                    <button
                                        className="switchButton"
                                        onClick={() => {
                                            switchGame(game.id);
                                            toggleSwitchGame();
                                        }}
                                    >
                                        Switch to Game
                                    </button>
                                    </li>
                                </li>
                            ))}
                        </ul>
                        <button className="closeButton" onClick={toggleSwitchGame}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderBar;
