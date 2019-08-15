import React, { useContext, useEffect, useState } from "react";
import * as BABYLON from "babylonjs";
import PropTypes from 'prop-types';
import { Store } from '../../Store';
import './Home.scss';
import LoadingScreen from './../../Components/LoadingScreen'

import { textCanvasService, changingArtistNames, artistsList, loadFonts, smallTextAnimation } from './../../Components/BabylonScene/textCanvasService.js'
import { Materials } from "../../Components/BabylonScene/materialService"
import { paint } from '../../Components/BabylonScene/paintService'
import { cameraAnimationKeys, handAnimationKeys, cameraPosition, cardFlipRotationY, cardFlipRotationZ, cardFlipPosition, lightAnimationArray } from '../../Components/BabylonScene/animationKeys'
import { isTouchDevice } from '../../utils/isTouchDevice'
import { chromeModifier } from '../../utils/chromeModifier'
import BabylonScene, { SceneEventArgs } from "../../Components/BabylonScene"; // import the component above linking to file we just created.

import textCanvasTexture from '../../assets/textures/favoritDoubleSide-min.jpg'

const PageWithScene = () => {
    // const { state, dispatch } = useContext(Store);
    const [loading, setLoading] = useState(true);

    let movementCounter = 0;

    let loadingComponentShown = true
    let assetsLoaded, initalDone, firstRenderDone, firstMountDone = false;
    let loadingCounter = 0;
    const isTouchDeviceCheck = isTouchDevice();

    const cardFrontVector = new BABYLON.Vector4(0.5,0, 1, 1); // front image = half the whole image along the width
    const cardBackVector = new BABYLON.Vector4(0,0, 0.5, 1); // back image = second half along the width
    const card = {
        width: isTouchDeviceCheck ? 11 : 14,
        height: isTouchDeviceCheck ? 17: 21.6363636364,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        frontUVs: cardFrontVector,
        backUVs: cardBackVector
    }
    const cardPosition = new BABYLON.Vector3(0, 0, 3)
    const cardOutside = {
        width: isTouchDeviceCheck ? card.width + 20 : card.width + 55,
        height: isTouchDeviceCheck ? card.height + 20 : card.height + 55
    }
    const pixelCard = {
        width: card.width * (isTouchDeviceCheck ? chromeModifier(32) : chromeModifier(32)),
        height: card.height * (isTouchDeviceCheck ? chromeModifier(32) : chromeModifier(32))
    }
    let hand;
    let camera;
    let handTouchAnimation;
    let cameraAnimation;

    const handStartingPosition = {x: 0, y: -5, z: -10}

    const initialSetup = (scene, canvas) => {
        // // SKY
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        // scene.clearColor = new BABYLON.Color4(247 / 255, 201 / 255, 168 / 255, 1);
      scene.clearColor = new BABYLON.Color4(200 / 255, 200 / 255, 200 / 255, 1);

        // Skybox
        // const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:90.0}, scene);
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

            const scaling = 2
            hand.material = handMaterial
            hand.scaling = new BABYLON.Vector3( scaling , scaling, scaling);
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
      //   const cardLight = new BABYLON.DirectionalLight("cardLight", new BABYLON.Vector3(-1, -0.7, 1.5), scene);
      // cardLight.intensity = 2
      // cardLight.diffuse = new BABYLON.Color3(0.6, 0.5, 0.3);
      // cardLight.specular = new BABYLON.Color3(0.8, 0.4, 0.2);
      // cardLight.groundColor = new BABYLON.Color3(0.8, 0.4, 0.2);
      // const cardLightPassive = new BABYLON.DirectionalLight("cardLight", new BABYLON.Vector3(0, 1, -0.5), scene);
      // cardLightPassive.intensity = 0.5
      // cardLightPassive.diffuse = new BABYLON.Color3(0.6, 0.5, 0.3);
      // cardLightPassive.specular = new BABYLON.Color3(1, 1, 1);
      // cardLightPassive.groundColor = new BABYLON.Color3(1, 1, 1);


      // const pointLight2 = new BABYLON.PointLight("light", new BABYLON.Vector3(60, 60, -400), scene);
      // const pointLight2 = new BABYLON.PointLight("light", new BABYLON.Vector3(60, 60, -400), scene);
        // pointLight.direction = new BABYLON.Vector3(10,10,999);
        // pointLight2.intensity = 0
        // pointLight2.diffuse = new BABYLON.Color3(0.6, 0.5, 0.3);
        // pointLight2.specular = new BABYLON.Color3(0.8, 0.4, 0.2);
      // pointLight2.diffuse = new BABYLON.Color3(0.6, 0.5, 0.3);
      // pointLight2.specular = new BABYLON.Color3(0.8, 0.8, 0.82);

      const hemLight = new BABYLON.HemisphericLight("hemiLight1", new BABYLON.Vector3(0, 1, -1), scene);
      hemLight.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
      hemLight.groundColor = new BABYLON.Color3(1, 1, 1);
      hemLight.intensity = 2
      //
      // const hemLight3 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(-1, .2, -1), scene);
      // hemLight3.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
      // hemLight3.groundColor = new BABYLON.Color3(1, 1, 1);
      // hemLight3.intensity = 0
      //
      // const Hemilight4 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 5, -8), scene);
      // Hemilight4.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
      // Hemilight4.groundColor = new BABYLON.Color3(1, 1, 1);
      // Hemilight4.intensity = 1
      //
      const hemLight2 = new BABYLON.HemisphericLight("hemiLight3", new BABYLON.Vector3(0, -1, -1), scene);
      hemLight2.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
      hemLight2.groundColor = new BABYLON.Color3(1, 1, 1);
      hemLight2.intensity = 2




      const spotLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 7, -20), new BABYLON.Vector3(0, 0, 0.7), Math.PI / 2, 50, scene);
      spotLight.specular = new BABYLON.Color3(0.3, 0.4, 1);
      spotLight.groundColor = new BABYLON.Color3(1, 1, 1);
      spotLight.intensity = 0.2

      const whiteSpotLight = new BABYLON.SpotLight("whiteSpotLight", new BABYLON.Vector3(0, 3, -20), new BABYLON.Vector3(-0.1, 0.3, 0.7), Math.PI / 2, 10, scene);
      whiteSpotLight.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
      whiteSpotLight.groundColor = new BABYLON.Color3(1, 1, 1);
      whiteSpotLight.diffuse = new BABYLON.Color3(0, 0.1, 0);
      whiteSpotLight.intensity = 1
      whiteSpotLight.animations = lightAnimationArray




        // FRONT PLANE
        const planeCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",cardOutside, scene);
        const { frontMaterial, texture: frontTexture, frontTextureContext }  = Materials.getGroundMaterial(scene, hand, pixelCard)
        planeCanvas.material = frontMaterial;


      const backgroundSphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 100, diameterX: 100, sideOrientation: BABYLON.Mesh.BACKSIDE, arc: 0.5}, scene);
      const backgroundSphereMaterial = new BABYLON.StandardMaterial("MatText", scene);
      backgroundSphere.rotation.y = BABYLON.Tools.ToRadians(180);
      backgroundSphereMaterial.ambientColor = new BABYLON.Color3(0.7, 0.7, 0.7);
      backgroundSphereMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);

      backgroundSphere.material = backgroundSphereMaterial

      // BACK PLANE with TEXT
        const textCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",card, scene);
        textCanvas.position = cardPosition // move behind front
        const materialText = new BABYLON.StandardMaterial("MatText", scene);
        materialText.ambientColor = new BABYLON.Color3(0.18, 0.18, 0.18);
        materialText.diffuseColor = new BABYLON.Color3(0.18, 0.18, 0.18);
        textCanvas.material = materialText;
        materialText.diffuseTexture = new BABYLON.Texture(textCanvasTexture, scene);
      // textCanvas.visibility = 0

        // small animation text plane
      const smallCard = {
        width: card.width - 3,
        height: 5
      }
      const smallCardPixel = {
        width: smallCard.width * 60,
        height: smallCard.height *60
      }

      // const animationTextCanvas = BABYLON.MeshBuilder.CreatePlane("animationTextCanvas",smallCard, scene);
      // animationTextCanvas.position.z = 2.9 // move behind front
      // animationTextCanvas.position.y = -1.88 // move behind front

      // const dynamicTexture = new BABYLON.DynamicTexture('dynamicTexture', smallCardPixel, scene);
      // smallTextAnimation(dynamicTexture, smallCardPixel)
      //Check width of text for given font type at any size of font


      const animationTextMaterial = new BABYLON.StandardMaterial("Mat", scene);
      // animationTextMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
      animationTextMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
      animationTextMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
      // animationTextMaterial.diffuseTexture = dynamicTexture;
      // animationTextCanvas.material = animationTextMaterial;
      // dynamicTexture.drawText('DETTMANN', 20, 20, 'bold 300px aktiv-grotesk', 'black', 'white', true, true);


        // Plane behind everything (needed for skybox effect)
        // const worldPlane = BABYLON.MeshBuilder.CreatePlane("worldCanvas",{width: 1000, height:1000}, scene);
        // worldPlane.position.z = 4 // move behind front


        // CAMERA
        camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-90), BABYLON.Tools.ToRadians(90), 25, BABYLON.Vector3.Zero(), scene);
        console.log(isTouchDevice)
        if (isTouchDevice()) {
          camera.attachControl(canvas, false);
        }
        camera.focusOn([planeCanvas])
        camera.position = cameraPosition
        camera.animations = [cameraAnimation]

        // cardLight.excludedMeshes.push(planeCanvas);
        // light.excludedMeshes.push(planeCanvas);
      hemLight.excludedMeshes.push(backgroundSphere);
      hemLight2.excludedMeshes.push(backgroundSphere);
      // hemLight3.excludedMeshes.push(backgroundSphere);


      // const dynamicTextTexture = new BABYLON.DynamicTexture("dynamic text texture", pixelCard, scene);
        // materialText.diffuseTexture = dynamicTextTexture
        // let ctx = textCanvasService(dynamicTextTexture, window.innerWidth, window.innerHeight)
        // ctx = changingArtistNames(ctx, 0, window.innerWidth, window.innerHeight)
        // artistsList.forEach((name, index) => {
        //     ctx = changingArtistNames(ctx, index, window.innerWidth, window.innerHeight)
        // })

        // dynamicTextTexture.update();
        initalDone = true

        return { frontMaterial, frontTexture, frontTextureContext,camera, smallCardPixel, textCanvas, whiteSpotLight}
    }




    const getGroundPosition = (scene) => {
        // Use a predicate to get position on the ground
        const pickinfo = scene.pick(scene.pointerX, scene.pointerY);
        return pickinfo.pickedPoint;
    }

    const isBack = true;
    const onSceneMount = (e) => {
        loadFonts()
        let { canvas, scene, engine } = e;
        let { frontTexture, frontTextureContext, camera, dynamicTexture, smallCardPixel, textCanvas, whiteSpotLight } = initialSetup(scene, canvas)
        let lastHandPosition = handStartingPosition;

        scene.beginAnimation(camera, 0, 1200, true);

        const cardFlip = (scene) => {
          scene.beginDirectAnimation(textCanvas, [cardFlipRotationY, cardFlipRotationZ, cardFlipPosition], 0, 50, false);
        }
      // const cardFlipBack = (scene) => {
      //   scene.beginDirectAnimation(textCanvas, [cardFlipRotationY, cardFlipRotationZ, cardFlipPosition], 0, 50, false, -1);
      //   // // change name
      //   setInterval(() => {
      //     if (isBack) {
      //
      //     }
      //     scene.beginAnimation(textCanvas, [cardFlipRotationY, cardFlipRotationZ, cardFlipPosition], 0, 50, false);
      //   }, 20000)
      // }

      const startLightAnimation = (scene) => {
          console.log('started light animation')
        scene.beginAnimation(whiteSpotLight, 0, 100000, true);
      }

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
                paint(frontTextureContext, frontTexture, cardOutside, pixelCard, current, isTouchDeviceCheck);
                movementCounter++;
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
                        movementCounter++;
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

      // // change name
      // setInterval(() => {
      //   smallTextAnimation(dynamicTexture, smallCardPixel)
      // }, 2000)

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
                if (assetsLoaded && initalDone && firstRenderDone && firstMountDone) {
                    loadingCounter ++
                    if (loadingCounter === 4) {
                        setLoading(false)
                        startLightAnimation(scene)

                      // changingNamesTimer = setAnimationTimer(smallTextAnimation(dynamicTexture, smallCardPixel))
                    } else if (loadingCounter > 4) {
                      // console.log(movementCounter)
                      console.log(engine.getFps().toFixed() + " fps");
                      if (movementCounter > 110 && movementCounter < 120 )  {
                        // scene.debugLayer.show();
                        console.log('REACHED LIMIT!')
                        cardFlip(scene)
                      }
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