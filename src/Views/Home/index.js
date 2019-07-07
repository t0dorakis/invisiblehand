import React, { useContext, useEffect } from "react";
import * as BABYLON from "babylonjs";
import * as HAMMER from 'hammerjs';
import PropTypes from 'prop-types';
import { Store } from '../../Store';
import './Home.scss';

import { textCanvasService, changingArtistNames, artistsList } from './../../Components/BabylonScene/textCanvasService.js'
import { getGroundMaterial} from "../../Components/BabylonScene/materialService"
import { paint } from '../../Components/BabylonScene/paintService'
import { cameraAnimationKeys, handAnimationKeys } from '../../Components/BabylonScene/animationKeys'

import BabylonScene, { SceneEventArgs } from "../../Components/BabylonScene"; // import the component above linking to file we just created.


const PageWithScene = () => {
    const { state } = useContext(Store);
    let fingerPosition = {x:0, y:0};
    let fingerIsTouching;

    let assetsLoaded = false;
    let hand;
    let camera;
    let handTouchAnimation;
    let cameraAnimation;

    const handStartingPosition = {x: 0, y: -14, z: -10}

    const initialSetup = (scene, canvas) => {
        // // SKY
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        scene.clearColor = new BABYLON.Color4(0,0,0,0)
        // var envTexture =‚ new BABYLON.CubeTexture("./assets/skybox.dds", scene);
        // scene.createDefaultSkybox(envTexture, true, 1000);
        // Skybox
        // const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:90.0}, scene);
        // // skybox.rotation.y = BABYLON.Tools.ToRadians(90);
        // const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        // skyboxMaterial.backFaceCulling = false;
        // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox", scene);
        // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        // skybox.material = skyboxMaterial;

        handTouchAnimation = new BABYLON.Animation("handTouchAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        handTouchAnimation.setKeys(handAnimationKeys);


        cameraAnimation = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        cameraAnimation.setKeys(cameraAnimationKeys);



        BABYLON.SceneLoader.ImportMesh("", "./assets/", "scene.babylon", scene, (newMeshes) => {
            assetsLoaded = true
            hand = newMeshes[0]
            const handMaterial = new BABYLON.StandardMaterial("handMat", scene);
            handMaterial.pointsCloud = true;
            handMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            // handMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.01);


            hand.material = handMaterial
            hand.scaling = new BABYLON.Vector3(3, 3, 3);
            hand.position.z = -10
            hand.position.y = -15

            hand.animations = [];
            hand.animations.push(handTouchAnimation);

        })



        // // LIGHT
        // const pointLight = new BABYLON.PointLight("light", new BABYLON.Vector3(9, 50, -20), scene);
        // // pointLight.direction = new BABYLON.Vector3(10,10,999);
        // pointLight.intensity = 10
        // pointLight.diffuse = new BABYLON.Color3(0.9, 1, 1);
        // pointLight.specular = new BABYLON.Color3(1, 1, 1);
        //
        const pointLight2 = new BABYLON.PointLight("light", new BABYLON.Vector3(60, 60, -500), scene);
        // pointLight.direction = new BABYLON.Vector3(10,10,999);
        pointLight2.intensity = 2
        pointLight2.diffuse = new BABYLON.Color3(0.7, 0.5, 0.2);
        pointLight2.specular = new BABYLON.Color3(0.9, 0.5, 0.2);

        //Light direction is up and left
        const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 5, -8), scene);
        light.diffuse = new BABYLON.Color3(0.1, 0.1, 0.09);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.groundColor = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1

        // CAMERA
        camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(90), 25, BABYLON.Vector3.Zero(), scene);
        // camera.attachControl(canvas, true);
        // const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        // light.intensity = 0.7;

        // FRONT PLANE
        const planeCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",{width: (22 / (window.innerHeight / window.innerWidth)), height:22}, scene);
        camera.focusOn([planeCanvas])
        camera.position = new BABYLON.Vector3(20,5,-30)
        camera.animations = [cameraAnimation]
        const { frontMaterial, texture: frontTexture, frontTextureContext }  = getGroundMaterial(scene, hand)
        planeCanvas.material = frontMaterial;



        // BACK PLANE with TEXT
        const textCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",{width: (22 / (window.innerHeight / window.innerWidth)), height:22}, scene);
        textCanvas.position.z = 3 // move behind front
        const materialText = new BABYLON.StandardMaterial("MatText", scene);
        materialText.ambientColor = new BABYLON.Color3(1, 1, 1);
        materialText.diffuseColor = new BABYLON.Color3(1, 1, 1);

        const gl = new BABYLON.GlowLayer("planeCanvas", scene);

        // Plane behind everything (needed for skybox effect)
        const worldPlane = BABYLON.MeshBuilder.CreatePlane("worldCanvas",{width: (100 / (window.innerHeight / window.innerWidth)), height:100}, scene);
        worldPlane.position.z = 4 // move behind front

        pointLight2.excludedMeshes.push(worldPlane);
        light.excludedMeshes.push(planeCanvas);

        textCanvas.material = materialText;
        const textureResolution = {width: window.innerWidth, height: window.innerHeight};
        const dynamicTextTexture = new BABYLON.DynamicTexture("dynamic text texture", textureResolution, scene);
        materialText.diffuseTexture = dynamicTextTexture
        let ctx = textCanvasService(dynamicTextTexture, window.innerWidth, window.innerHeight)
        // ctx = changingArtistNames(ctx, 0, window.innerWidth, window.innerHeight)
        dynamicTextTexture.update();

        return { frontMaterial, frontTexture, frontTextureContext,camera, dynamicTextTexture, ctx}
    }




    const getGroundPosition = function (scene) {
        // Use a predicate to get position on the ground
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY);
        return pickinfo.pickedPoint;
    }

    const onSceneMount = (e) => {
        const { canvas, scene, engine } = e;

        scene.debugLayer.show();


        let { frontTexture, frontTextureContext, camera, dynamicTextTexture, ctx  } = initialSetup(scene, canvas)
        scene.beginAnimation(camera, 0, 1200, true);
        // hammerjs listens to mouse move
        // Create an instance of Hammer with the reference.
        const hammer = new HAMMER(canvas);

        let firstTouch = true;
        let lastHandPosition = handStartingPosition;
        hammer.on("panleft pan panright tap press", (ev)=> {
            const current = getGroundPosition(scene);
            // console.log(current);
            if (current !== null) {
                const aimedHandPosition = { x: current.x, y: current.y -15, z: -2.2}
                // hand.position = aimedHandPosition
                const tempKeys = [{frame: 0, value: lastHandPosition},{frame: 5, value:aimedHandPosition}]
                const tempAnimation = new BABYLON.Animation("handTouchAnimation", "position", 5, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                tempAnimation.setKeys(tempKeys)
                scene.beginDirectAnimation(hand, [tempAnimation], 0, 10, false, 5, (callback) => {
                    lastHandPosition = aimedHandPosition
                });

            }
            // console.log(ev)
            if (assetsLoaded && firstTouch) {
                firstTouch = !firstTouch
                scene.beginAnimation(hand, 0, 50, true);
                // hand.translate(new BABYLON.Vector3(1, 0, 0), 3);
            }
            // camera.target = new BABYLON.Vector3(BABYLON.Tools.ToRadians(-90 + ( ev.center.x / 5)), BABYLON.Tools.ToRadians(90 - ( ev.center.y / 5)), 25, BABYLON.Vector3.Zero())
            fingerPosition = ev.center;
            fingerIsTouching = ev.isFirst;
            paint(frontTextureContext, frontTexture, fingerPosition, fingerIsTouching);

            if (ev.isFinal){
                fingerIsTouching = ev.isFinal
                // camera.target = new BABYLON.Vector3(BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), 25)

            }
        });

        let counter = 0

        const update = () => {
            if (counter > (artistsList.length - 1)) {
                counter = 0
            }
            ctx = changingArtistNames(ctx, counter, window.innerWidth, window.innerHeight)
            counter ++
            dynamicTextTexture.update();
        }

        engine.runRenderLoop(() => {
            if (scene) {
                update(scene)
                scene.render();
            }
        });
    };


        return (
            <div>
                <div className="scene-wrapper">
                    <BabylonScene
                        width={window.innerWidth}
                        height={window.innerHeight}
                        onSceneMount={onSceneMount}
                        className="babylon-scene"
                    />
                </div>
            </div>
        );
}

PageWithScene.propTypes = {
    fingerIsTouching: PropTypes.bool,
    fingerPosition: PropTypes.object
};

export default PageWithScene;