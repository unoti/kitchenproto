import './App.css';
import Kitchen from "./components/Kitchen"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Kitchen playerId={1}/>
      </header>
    </div>
  );
}

export default App;
