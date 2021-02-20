import HomePage from "./pages/homepage/homepage.component";

import "./App.css";
import NavigationBar from "./components/navigation-bar/navigation-bar.component";

function App() {
  return (
    <div className="app">
      <NavigationBar />
      <HomePage />
    </div>
  );
}

export default App;
