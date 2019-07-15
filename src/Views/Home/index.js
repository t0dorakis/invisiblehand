import React, { useContext, useEffect, useState } from "react";
import * as BABYLON from "babylonjs";
import PropTypes from 'prop-types';
import { Store } from '../../Store';
import './Home.scss';
import LoadingScreen from './../../Components/LoadingScreen'

import { textCanvasService, changingArtistNames, artistsList, loadFonts } from './../../Components/BabylonScene/textCanvasService.js'
import { Materials } from "../../Components/BabylonScene/materialService"
import { paint } from '../../Components/BabylonScene/paintService'
import { cameraAnimationKeys, handAnimationKeys, cameraPosition } from '../../Components/BabylonScene/animationKeys'
import { isTouchDevice } from '../../utils/isTouchDevice'
import BabylonScene, { SceneEventArgs } from "../../Components/BabylonScene"; // import the component above linking to file we just created.

import textCanvasTexture from '../../assets/textures/textCanvasPreSetTexture.jpg'

const PageWithScene = () => {
    const { state, dispatch } = useContext(Store);
    const [loading, setLoading] = useState(true);

    let loadingComponentShown = true
    let assetsLoaded, initalDone, firstRenderDone, firstMountDone = false;
    let loadingCounter = 0;
    const isTouchDeviceCheck = isTouchDevice();
    const card = {
        width: 11,
        height: 20
    }
    const cardOutside = {
        width: window.innerWidth > 600 ? card.width + 2 : card.width + 9,
        height: window.innerWidth > 600 ? card.height + 2 : card.height + 9
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
        scene.clearColor = new BABYLON.Color4(0.84, 0.6875, 0.59765625, 1);

        // Skybox
        // const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:90.0}, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
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
        textCanvas.material = materialText;
        materialText.diffuseTexture = new BABYLON.Texture(textCanvasTexture, scene);


        const gl = new BABYLON.GlowLayer("planeCanvas", scene);

        // Plane behind everything (needed for skybox effect)
        // const worldPlane = BABYLON.MeshBuilder.CreatePlane("worldCanvas",{width: 1000, height:1000}, scene);
        // worldPlane.position.z = 4 // move behind front


        // CAMERA
        camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(90), 25, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        camera.focusOn([planeCanvas])
        camera.position = cameraPosition
        camera.animations = [cameraAnimation]

        pointLight2.excludedMeshes.push(textCanvas);
        light.excludedMeshes.push(planeCanvas);

        // const dynamicTextTexture = new BABYLON.DynamicTexture("dynamic text texture", pixelCard, scene);
        // materialText.diffuseTexture = dynamicTextTexture
        // let ctx = textCanvasService(dynamicTextTexture, window.innerWidth, window.innerHeight)
        // ctx = changingArtistNames(ctx, 0, window.innerWidth, window.innerHeight)
        // artistsList.forEach((name, index) => {
        //     ctx = changingArtistNames(ctx, index, window.innerWidth, window.innerHeight)
        // })

        // dynamicTextTexture.update();
        initalDone = true

        return { frontMaterial, frontTexture, frontTextureContext,camera}
    }




    const getGroundPosition = (scene) => {
        // Use a predicate to get position on the ground
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY);
        return pickinfo.pickedPoint;
    }


    const onSceneMount = (e) => {
        loadFonts()
        let { canvas, scene, engine } = e;
        let { frontTexture, frontTextureContext, camera } = initialSetup(scene, canvas)
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

        const touchmove = (ev) => {
            ev.preventDefault();
            const x = ev.touches[0].clientX
            const y = ev.touches[0].clientY
            const current = getGroundPosition(scene);
            if ((current !== null) && firstRenderDone && assetsLoaded) {
                animateHand(scene, current)
                if (firstTouch) {
                    firstTouch = !firstTouch
                    scene.beginAnimation(hand, 0, 50, true);
                }
                paint(frontTextureContext, frontTexture, cardOutside, pixelCard, current);
            }

        }


        const pointermove = (ev) => {
                ev.preventDefault();
                const x = ev.clientX
                const y = ev.clientY
                const current = getGroundPosition(scene);
                if ((current !== null) && firstRenderDone && assetsLoaded) {
                    animateHand(scene, current)
                    if (firstTouch) {
                        firstTouch = !firstTouch
                        scene.beginAnimation(hand, 0, 50, true);
                    }
                    if (isTouchDeviceCheck) {
                        paint(frontTextureContext, frontTexture, cardOutside, pixelCard, current);
                    } else if (ev.buttons > 0) {
                        paint(frontTextureContext, frontTexture, cardOutside, pixelCard, current);

                    }
                }
            }


        let firstTouch = true;
         canvas.addEventListener('mousemove', ev => {
             const current = getGroundPosition(scene);
             animateHand(scene, current)
         })
        canvas.addEventListener('touchmove', touchmove, false);
        canvas.addEventListener( "pointermove", pointermove)
        firstMountDone = true

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
                if (assetsLoaded && initalDone && firstRenderDone && firstMountDone) {
                    loadingCounter ++
                    if (loadingCounter === 4) {
                        setLoading(false)
                    }
                }
                firstRenderDone = true
                // waitBeforeHideLoading()
            }
        });
    };


        return (
            <div>
                <div className="scene-wrapper">
                    <LoadingScreen visible={loading}/>
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