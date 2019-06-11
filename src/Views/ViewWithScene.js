import * as React from "react";
import * as BABYLON from "babylonjs";
import * as HAMMER from 'hammerjs';
import PropTypes from 'prop-types';

import BabylonScene, { SceneEventArgs } from "../Components/BabylonScene"; // import the component above linking to file we just created.


const PageWithScene = () => {

    const onSceneMount = (e) => {

        const { canvas, scene, engine } = e;

        let hand = new BABYLON.Mesh();
        let assetsLoaded = false
        scene.clearColor = new BABYLON.Color3(0.7, 0.7, 0.7);
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        const sphere = BABYLON.Mesh.CreateSphere("sphrere", 1, 1, scene);


        const planeCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",{width: 5, height:8}, scene);

        //Create dynamic texture
        var textureResolution = 512;
        var textureGround = new BABYLON.DynamicTexture("dynamic texture", textureResolution, scene);
        var textureContext = textureGround.getContext();

        var materialGround = new BABYLON.StandardMaterial("Mat", scene);
        materialGround.diffuseTexture = textureGround;
        planeCanvas.material = materialGround;

        textureContext.fillStyle = "black";
        textureContext.fill();
        textureGround.update();

        textureContext.beginPath();
        textureContext.arc(100, 75, 50, 0, 2 * Math.PI);
        textureContext.fillStyle = "white";
        textureContext.fill();
        textureGround.update();


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


        BABYLON.SceneLoader.Append(
            './assets/',
            'hand.gltf',
            scene,
            (scene) => {
                // planeCanvas.material = myMaterial
                console.log('SUCCESS')
                // scene.meshes[1].name = 'hand'
                hand = scene.meshes[scene.meshes.length -1]
                assetsLoaded = true
                scene.addMesh(planeCanvas)

            },
            (progress) => {
                console.log('Pogress',progress)
            },
            (error) => {
                console.log('Error')
            },
        );

        engine.runRenderLoop(() => {
            if (scene && assetsLoaded) {
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