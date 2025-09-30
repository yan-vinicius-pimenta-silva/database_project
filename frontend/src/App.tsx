import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";
import Loads from "./pages/Loads";
import Trips from "./pages/Trips";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/loads" element={<Loads />} />
        <Route path="/trips" element={<Trips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;   // <--- this line is mandatory
