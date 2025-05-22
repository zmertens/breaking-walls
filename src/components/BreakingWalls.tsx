import { useEffect, useState } from "react";
import Module, { Physics } from "../mazebuilderphysics";

const BreakingWalls = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [mazeInfo, setMazeInfo] = useState<any | null>(null);
  const [lastJSONSize, setLastJSONSize] = useState<number>(0);
  const [instance, setInstance] = useState<Physics | null>(null);

  let intervalId = -1;

  // Poll for maze data periodically, look only for last-generated maze
  const pollForMazeData = (mbi: Physics) => {
    intervalId = setInterval(async () => {
      try {
        if (mbi) {
          const mazeInfoJson = "";//await mbi.mazes();
          // Check if the JSON has changed, if so, update the state
          if (mazeInfoJson.length > 0 && mazeInfoJson.length !== lastJSONSize) {
            setLastJSONSize(mazeInfoJson.length);
            const mazeInfo = JSON.parse(mazeInfoJson);
            setMazeInfo(mazeInfo);
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        clearInterval(intervalId);
      }
    }, 1000); // Check every 1 second
  }; // pollForMazeData

  useEffect(() => {
    const canvas = document.querySelector('canvas.emscripten');

    const loadModule = async () => {
      const activeModule = await Module({
        width: windowSize.width,
        height: windowSize.height
      });
      if (activeModule) {
        // let mbi = activeModule.get();
        // if (mbi) {
          // setInstance(mbi);
          // pollForMazeData(mbi);
        // } else {
          // console.error("Failed to create instance");
        // }
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
