import React, { useEffect } from "react";
import * as BABYLON from "babylonjs";
import * as HAMMER from 'hammerjs';
import { Store } from './../Store';


const BabylonScene = ({scene, engine, engineOptions ,adaptToDeviceRatio, width, height, onSceneMount}) => {
    let canvas;

    const { state, dispatch } = React.useContext(Store);


    const onResizeWindow = () => {
        if (engine) {
            engine.resize();
        }
    };

    useEffect(() => {
            engine = new BABYLON.Engine(
                canvas,
                true,
                engineOptions,
                adaptToDeviceRatio
            );

            scene = new BABYLON.Scene(engine);

            if (typeof onSceneMount === "function") {
                onSceneMount({
                    scene,
                    engine,
                    canvas
                });
            } else {
                console.error("onSceneMount function not available");
            }

        // hammerjs listens to mouse move
        // Create an instance of Hammer with the reference.
        const hammer = new HAMMER(canvas);
        hammer.on("panleft panright tap press", (ev)=> {
            dispatch({
                type: 'SET_FINGER_POSITION',
                payload: ev.center
            },);
            dispatch({
                type: 'FINGER_STARTS_TOUCHING',
            });

            if (ev.isFinal){
                dispatch({
                    type: 'FINGER_STOPS_TOUCHING',
                });
            }
        });

        // Resize the babylon engine when the window is resized
        window.addEventListener("resize", onResizeWindow);
        return function cleanup() {
            window.removeEventListener("resize", onResizeWindow);
        }
    }, []);

    const onCanvasLoaded = (c) => {
        if (c !== null) {
            canvas = c;
        }
    };

    let opts = {};

    if (width !== undefined && height !== undefined) {
        opts.width = width;
        opts.height = height;
    }

    return (
        <canvas {...opts} id="babylonCanvas" ref={onCanvasLoaded} />
    )
}

export default BabylonScene;