import { Canvas } from "./builder/canvas/Canvas";
import { BuilderDndContext } from "./builder/dnd/BuilderDndContext";
import { Palette } from "./builder/palette/Palette";

function App() {
  return (
    <BuilderDndContext>
      <div className="flex h-screen">
        <Palette />
        <Canvas />
      </div>
    </BuilderDndContext>
  );
}

export default App;
