import { Canvas } from "./builder/canvas/Canvas";
import { Palette } from "./builder/palette/Palette";

function App() {
  return (
    <div className="flex h-screen">
      <Palette />
      <Canvas />
    </div>
  );
}

export default App;
