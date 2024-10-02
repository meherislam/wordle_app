import './App.css';
import WordleBoard from "./components/WordleBoard/WordleBoard";
import HeaderBar from "./components/Headerbar/Headerbar";

function App() {
    return (
        <div className="App">
            <HeaderBar />
            <div className="container">
                <div className="board-wrapper">
                    <WordleBoard />
                </div>
            </div>
        </div>
    );
}

export default App;
