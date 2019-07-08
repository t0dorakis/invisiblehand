import React, { useContext, useEffect } from "react";
import * as BABYLON from "babylonjs";
import * as HAMMER from 'hammerjs';
import PropTypes from 'prop-types';
import { Store } from '../../Store';
import './Home.scss';

import { textCanvasService, changingArtistNames, artistsList } from './../../Components/BabylonScene/textCanvasService.js'
import { Materials } from "../../Components/BabylonScene/materialService"
import { paint } from '../../Components/BabylonScene/paintService'
import { cameraAnimationKeys, handAnimationKeys } from '../../Components/BabylonScene/animationKeys'

import BabylonScene, { SceneEventArgs } from "../../Components/BabylonScene"; // import the component above linking to file we just created.


const PageWithScene = () => {
    const { state } = useContext(Store);
    let fingerPosition = {x:0, y:0};
    let fingerIsTouching;
    let firstRenderDone = false
    let assetsLoaded = false;

    const card = {
        width: 11,
        height: 20
    }
    const cardOutside = {
        width: window.innerWidth > 600 ? 13 : 20,
        height: window.innerWidth > 600 ? 22 : 29
    }
    const pixelCard = {
        width: card.width * 32,
        height: card.height * 32,
    }
    let hand;
    let camera;
    let handTouchAnimation;
    let cameraAnimation;

    const handStartingPosition = {x: 0, y: -5, z: -10}

    const initialSetup = (scene, canvas) => {
        // // SKY
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        scene.clearColor = new BABYLON.Color4(0,0,0,0)

        // Skybox
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:90.0}, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

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
            hand.scaling = new BABYLON.Vector3(2, 2, 2);
            hand.position = handStartingPosition

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
        pointLight2.diffuse = new BABYLON.Color3(0.6, 0.5, 0.3);
        pointLight2.specular = new BABYLON.Color3(0.8, 0.4, 0.2);

        //Light direction is up and left
        const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 5, -8), scene);
        light.diffuse = new BABYLON.Color3(0.1, 0.1, 0.09);
        light.specular = new BABYLON.Color3(0, 0, 0);
        light.groundColor = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1


        // FRONT PLANE
        const planeCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",cardOutside, scene);
        const { frontMaterial, texture: frontTexture, frontTextureContext }  = Materials.getGroundMaterial(scene, hand, pixelCard)
        planeCanvas.material = frontMaterial;


        // BACK PLANE with TEXT
        const textCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",card, scene);
        textCanvas.position.z = 3 // move behind front
        const materialText = new BABYLON.StandardMaterial("MatText", scene);
        materialText.ambientColor = new BABYLON.Color3(1, 1, 1);
        materialText.diffuseColor = new BABYLON.Color3(1, 1, 1);

        const gl = new BABYLON.GlowLayer("planeCanvas", scene);

        // Plane behind everything (needed for skybox effect)
        const worldPlane = BABYLON.MeshBuilder.CreatePlane("worldCanvas",{width: 1000, height:1000}, scene);
        worldPlane.position.z = 4 // move behind front


        // CAMERA
        camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(90), 25, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        camera.focusOn([planeCanvas])
        camera.position = new BABYLON.Vector3(20,5,-30)
        camera.animations = [cameraAnimation]

        pointLight2.excludedMeshes.push(worldPlane);
        light.excludedMeshes.push(planeCanvas);

        textCanvas.material = materialText;
        const dynamicTextTexture = new BABYLON.DynamicTexture("dynamic text texture", pixelCard, scene);
        materialText.diffuseTexture = dynamicTextTexture
        let ctx = textCanvasService(dynamicTextTexture, window.innerWidth, window.innerHeight)
        // ctx = changingArtistNames(ctx, 0, window.innerWidth, window.innerHeight)
        artistsList.forEach((name, index) => {
            ctx = changingArtistNames(ctx, index, window.innerWidth, window.innerHeight)
        })

        dynamicTextTexture.update();

        return { frontMaterial, frontTexture, frontTextureContext,camera, dynamicTextTexture, ctx}
    }




    const getGroundPosition = (scene) => {
        // Use a predicate to get position on the ground
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY);
        return pickinfo.pickedPoint;
    }


    const onSceneMount = (e) => {
        let { canvas, scene, engine } = e;
        let { frontTexture, frontTextureContext, camera, dynamicTextTexture, ctx  } = initialSetup(scene, canvas)
        let lastHandPosition = handStartingPosition;

        scene.beginAnimation(camera, 0, 1200, true);

        // scene.debugLayer.show();
        const animateHand = (scene, current) => {
            // console.log(current);
            if ((current !== null) && firstRenderDone && assetsLoaded) {
                const aimedHandPosition = { x: current.x, y: current.y -9, z: -2.2}
                // hand.position = aimedHandPosition
                const tempKeys = [{frame: 0, value: lastHandPosition},{frame: 3, value:aimedHandPosition}]
                const tempAnimation = new BABYLON.Animation("handTouchAnimation", "position", 5, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                tempAnimation.enableBlending = true;
                tempAnimation.blendingSpeed = 0.5;
                const easingFunction = new BABYLON.QuarticEase();
                easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
                tempAnimation.setEasingFunction(easingFunction);
                tempAnimation.setKeys(tempKeys)
                scene.beginDirectAnimation(hand, [tempAnimation], 0, 3, false, 5, (callback) => {
                });
                lastHandPosition = aimedHandPosition

            }
        }
        // hammerjs listens to mouse move
        // Create an instance of Hammer with the reference.
        const hammer = new HAMMER(canvas);

        let firstTouch = true;
         canvas.addEventListener('mousemove', e => {
             const current = getGroundPosition(scene);
             animateHand(scene, current)
         })
        hammer.on("pan", (ev)=> {
            const current = getGroundPosition(scene);
            animateHand(scene, current)
            if (assetsLoaded && firstTouch) {
                firstTouch = !firstTouch
                scene.beginAnimation(hand, 0, 50, true);
            }
            fingerPosition = ev.center;
            fingerIsTouching = ev.isFirst;
            paint(frontTextureContext, frontTexture, fingerPosition, fingerIsTouching, cardOutside, pixelCard, current);
            if (ev.isFinal){
                fingerIsTouching = ev.isFinal
            }
        });

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
                firstRenderDone = true
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