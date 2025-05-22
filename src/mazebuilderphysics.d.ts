/// <reference types="emscripten" />
// https://ecolingui.ca/en/blog/emguide-3/

export declare class Physics {
  delete: () => void;
}

interface MazeBuilderModule extends EmscriptenModule {
  get: () => Physics;
}

declare const Module: EmscriptenModuleFactory<MazeBuilderModule>;
export default Module;
