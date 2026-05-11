import { Canvas } from "./builder/canvas/Canvas";
import { BuilderDndContext } from "./builder/dnd/BuilderDndContext";
import { Palette } from "./builder/palette/Palette";
import { PropertiesPanel } from "./builder/properties/PropertiesPanel";

function App() {
  return (
    <BuilderDndContext>
      <div className="flex h-screen">
        <Palette />
        <Canvas />
        <PropertiesPanel />
      </div>
    </BuilderDndContext>
  );
}

export default App;
