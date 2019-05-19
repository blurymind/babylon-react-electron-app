import * as BABYLON from 'babylonjs';
import React, { Component } from 'react';

export type SceneEventArgs = {
  engine: BABYLON.Engine,
  scene: BABYLON.Scene,
  canvas: HTMLCanvasElement
};

export type SceneProps = {
  engineOptions?: BABYLON.EngineOptions,
  adaptToDeviceRatio?: boolean,
  onSceneMount?: (args: SceneEventArgs) => void,
  width?: number,
  height?: number
};

export default class BabylonScene extends Component<SceneProps & React.HTMLAttributes<HTMLCanvasElement>, {}> {

  // private scene: BABYLON.Scene;
  // private engine: BABYLON.Engine;
  // private canvas: HTMLCanvasElement;

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
      this.forceUpdate()
    }
  }

  componentDidMount () {
    this.engine = new BABYLON.Engine(
        this.canvas,
        true,
        this.props.engineOptions,
        this.props.adaptToDeviceRatio
    );

    let scene = new BABYLON.Scene(this.engine);
    this.scene = scene;

    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        scene,
        engine: this.engine,
        canvas: this.canvas
      });
    } else {
      console.error('onSceneMount function not available');
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  onCanvasLoaded = (c : HTMLCanvasElement) => {
    if (c !== null) {
      this.canvas = c;
    }
  }

  render () {
    // 'rest' can contain additional properties that you can flow through to canvas:
    // (id, className, etc.)
    const { width, height, ...rest } = this.props;

    const opts: any = {};

    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    } else {
      opts.width = window.innerWidth;
      opts.height = window.innerHeight;
    }

    return (
      <canvas
        {...opts}
        ref={this.onCanvasLoaded}
      />
    )
  }
}