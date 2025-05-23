import { useEffect, useState } from "react";
import Module, { Physics } from "../mazebuilderphysics";

const BreakingWalls = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [instance, setInstance] = useState<Physics | null>(null);

  useEffect(() => {
    const canvas = document.querySelector('canvas.emscripten');

    const loadModule = async () => {
      const activeModule = await Module({
        width: windowSize.width,
        height: windowSize.height
      });
      if (activeModule) {
        let mbi = activeModule.get();
        if (mbi) {
          setInstance(mbi);
        } else {
          console.error("Failed to create instance");
        }
      }
    };

    loadModule();

    const resizeObserver = new ResizeObserver((entries) => {
      if (canvas) {
        for (let entry of entries) {
          if (entry.target === document.documentElement) {
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
          }
        }
      }
    });

    resizeObserver.observe(document.documentElement);

    // Cleanup function to remove the event listener
    return () => {
      if (instance) {
        resizeObserver.disconnect();
        console.log("Deleting instance");
        instance.delete();
        setInstance(null);
      }
      resizeObserver.unobserve(document.documentElement);
    }
  }, []); // useEffect

  return (
    <>
    <div>
      <span>
        <canvas id="canvas" width={windowSize.width} height={windowSize.height} />
      </span>
    </div>
    </>
  );
};

export default BreakingWalls;
