import React, { useContext, useEffect } from "react";
import * as BABYLON from "babylonjs";
import * as HAMMER from 'hammerjs';
import PropTypes from 'prop-types';
import { Store } from './../Store';

import BabylonScene, { SceneEventArgs } from "../Components/BabylonScene"; // import the component above linking to file we just created.


const PageWithScene = () => {
    const { state } = useContext(Store);
    let fingerPosition = {x:0, y:0};
    let fingerIsTouching;

    const initialSetup = (scene, canvas) => {

        let hand = new BABYLON.Mesh();
        let assetsLoaded = false
        scene.clearColor = new BABYLON.Color4(1,0,0,0);

        const camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(90), 25, BABYLON.Vector3.Zero(), scene);
        // camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        light.intensity = 0.7;


        const planeCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",{width: 5, height:8}, scene);

        //Create dynamic texture
        const textureResolution = {width: window.innerWidth, height: window.innerHeight};
        const textureGround = new BABYLON.DynamicTexture("dynamic texture", textureResolution, scene);
        const textureContext = textureGround.getContext();

        const materialGround = new BABYLON.StandardMaterial("Mat", scene);
        materialGround.alpha = 0.2;
        materialGround.opacityFresnelParameters = new BABYLON.FresnelParameters();
        materialGround.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        materialGround.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        materialGround.diffuseTexture = textureGround;
        planeCanvas.material = materialGround;

        textureContext.fillStyle = "black";
        textureContext.fill();
        textureGround.update();

        textureContext.beginPath();
        textureContext.arc(200, 75, 50, 0, 2 * Math.PI);
        textureContext.fillStyle = "white";
        textureContext.fill();
        textureGround.update();

        return {textureGround, textureContext }
    }

    const paint = (textureContext, textureGround, fingerPosition, fingerIsTouching) => {
        textureContext.beginPath();
        textureContext.arc(fingerPosition.x, fingerPosition.y, 50, 0, 2 * Math.PI);
        textureContext.fillStyle = "white";
        textureContext.fill();
        textureGround.update();
    }

    const onSceneMount = (e) => {
        const { canvas, scene, engine } = e;

        const {textureContext, textureGround} = initialSetup(scene, canvas)
        // hammerjs listens to mouse move
        // Create an instance of Hammer with the reference.
        const hammer = new HAMMER(canvas);
        hammer.on("panleft panright tap press", (ev)=> {
            fingerPosition = ev.center;
            fingerIsTouching = ev.isFirst;
            paint(textureContext, textureGround, fingerPosition, fingerIsTouching);

            if (ev.isFinal){
                fingerIsTouching = ev.isFinal
            }
        });



        // //Draw on canvas
        // textureContext.beginPath();
        // textureContext.moveTo(75*2, 25*2);
        // textureContext.quadraticCurveTo(25*2, 25*2, 25*2, 62.5*2);
        // textureContext.quadraticCurveTo(25*2, 100*2, 50*2, 100*2);
        // textureContext.quadraticCurveTo(50*2, 120*2, 30*2, 125*2);
        // textureContext.quadraticCurveTo(60*2, 120*2, 65*2, 100*2);
        // textureContext.quadraticCurveTo(125*2, 100*2, 125*2, 62.5*2);
        // textureContext.quadraticCurveTo(125*2, 25*2, 75*2, 25*2);
        // textureContext.fillStyle = "white";
        // textureContext.fill();
        // textureGround.update();


        // BABYLON.SceneLoader.Append(
        //     './assets/',
        //     'hand.gltf',
        //     scene,
        //     (scene) => {
        //         // planeCanvas.material = myMaterial
        //         console.log('SUCCESS')
        //         // scene.meshes[1].name = 'hand'
        //         hand = scene.meshes[scene.meshes.length -1]
        //         assetsLoaded = true
        //         scene.addMesh(planeCanvas)
        //
        //     },
        //     (progress) => {
        //         console.log('Pogress',progress)
        //     },
        //     (error) => {
        //         console.log('Error')
        //     },
        // );

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });
    };


        return (
            <div>
                <BabylonScene
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onSceneMount={onSceneMount}
                />
            </div>
        );
}

PageWithScene.propTypes = {
    fingerIsTouching: PropTypes.bool,
    fingerPosition: PropTypes.object
};

export default PageWithScene;