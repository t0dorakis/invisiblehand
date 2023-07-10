import React, { useContext, useEffect, useState } from "react";
import * as BABYLON from "babylonjs";
import PropTypes from "prop-types";
import { Store } from "../../Store";
import "./Home.scss";
import LoadingScreen from "./../../Components/LoadingScreen";

import {
  textCanvasService,
  changingArtistNames,
  artistsList,
  loadFonts,
  smallTextAnimation,
} from "./../../Components/BabylonScene/textCanvasService.js";
import { Materials } from "../../Components/BabylonScene/materialService";
import { paint } from "../../Components/BabylonScene/paintService";
import {
  cameraAnimationKeys,
  handAnimationKeys,
  cameraPosition,
  cardFlipRotation,
  cardFlipPosition,
  cardFlipBackRotation,
  lightAnimationArray,
} from "../../Components/BabylonScene/animationKeys";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { chromeModifier } from "../../utils/chromeModifier";
import BabylonScene, { SceneEventArgs } from "../../Components/BabylonScene"; // import the component above linking to file we just created.

import textCanvasTexture from "../../assets/textures/favoritdoubleside_Q2_2023.png";

const PageWithScene = () => {
  // const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(Store);

  const loading = !state.loadingDone;
  // this variables are important for the flip mechanism
  let movementCounter = 0;
  const firstFlipMovementFrame = 200;
  const backFlipMovementFrame = 500;
  const waitDurationBeforeNextFlipTrigger = 1500;
  let isBack = false;
  let firstFlipReached = false;
  let flipAnimationIsRunning = false;

  let loadingComponentShown = true;
  let assetsLoaded,
    initalDone,
    firstRenderDone,
    firstMountDone = false;
  let loadingCounter = 0;
  const isTouchDeviceCheck = isTouchDevice();

  const cardFrontVector = new BABYLON.Vector4(0.5, 0, 1, 1); // front image = half the whole image along the width
  const cardBackVector = new BABYLON.Vector4(0, 0, 0.5, 1); // back image = second half along the width
  const card = {
    width: isTouchDeviceCheck ? 11 : 14,
    height: isTouchDeviceCheck ? 17 : 21.6363636364,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    frontUVs: cardFrontVector,
    backUVs: cardBackVector,
  };
  const cardPosition = new BABYLON.Vector3(0, 0, 3);
  const cardOutside = {
    width: isTouchDeviceCheck ? card.width + 20 : card.width + 55,
    height: isTouchDeviceCheck ? card.height + 20 : card.height + 55,
  };
  const pixelCard = {
    width:
      card.width *
      (isTouchDeviceCheck ? chromeModifier(32) : chromeModifier(32)),
    height:
      card.height *
      (isTouchDeviceCheck ? chromeModifier(32) : chromeModifier(32)),
  };
  let hand;
  let camera;
  let handTouchAnimation;
  let cameraAnimation;

  const handStartingPosition = { x: 0, y: -5, z: -10 };

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

    handTouchAnimation = new BABYLON.Animation(
      "handTouchAnimation",
      "position.z",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    handTouchAnimation.setKeys(handAnimationKeys);

    cameraAnimation = new BABYLON.Animation(
      "cameraAnimation",
      "position",
      30,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    cameraAnimation.setKeys(cameraAnimationKeys);

    BABYLON.SceneLoader.ImportMesh(
      "",
      "./assets/",
      "scene.babylon",
      scene,
      (newMeshes) => {
        assetsLoaded = true;
        hand = newMeshes[0];
        const handMaterial = new BABYLON.StandardMaterial("handMat", scene);
        handMaterial.pointsCloud = true;
        handMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        // handMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.01);

        const scaling = 2;
        hand.material = handMaterial;
        hand.scaling = new BABYLON.Vector3(scaling, scaling, scaling);
        hand.position = handStartingPosition;

        hand.animations = [];
        hand.animations.push(handTouchAnimation);
      }
    );

    // // LIGHT

    const hemLight = new BABYLON.HemisphericLight(
      "hemiLight1",
      new BABYLON.Vector3(0, 1, -1),
      scene
    );
    hemLight.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
    hemLight.groundColor = new BABYLON.Color3(1, 1, 1);
    hemLight.intensity = 2;

    const hemLight2 = new BABYLON.HemisphericLight(
      "hemiLight3",
      new BABYLON.Vector3(0, -1, -1),
      scene
    );
    hemLight2.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
    hemLight2.groundColor = new BABYLON.Color3(1, 1, 1);
    hemLight2.intensity = 2;

    const spotLight = new BABYLON.SpotLight(
      "blueSpotLight",
      new BABYLON.Vector3(0, 7, -20),
      new BABYLON.Vector3(0, 0, 0.7),
      Math.PI / 2,
      50,
      scene
    );
    spotLight.specular = new BABYLON.Color3(0.3, 0.4, 1);
    spotLight.groundColor = new BABYLON.Color3(1, 1, 1);
    spotLight.intensity = 0.3;

    const whiteSpotLight = new BABYLON.SpotLight(
      "whiteSpotLight",
      new BABYLON.Vector3(0, 3, -20),
      new BABYLON.Vector3(-0.1, 0.3, 0.7),
      Math.PI / 2,
      10,
      scene
    );
    whiteSpotLight.specular = new BABYLON.Color3(0.8, 0.8, 0.82);
    whiteSpotLight.groundColor = new BABYLON.Color3(1, 1, 1);
    whiteSpotLight.diffuse = new BABYLON.Color3(0, 0.1, 0);
    whiteSpotLight.intensity = 1;
    whiteSpotLight.animations = lightAnimationArray;

    // FRONT PLANE
    const planeCanvas = BABYLON.MeshBuilder.CreatePlane(
      "planeCanvas",
      cardOutside,
      scene
    );
    const {
      frontMaterial,
      texture: frontTexture,
      frontTextureContext,
    } = Materials.getGroundMaterial(scene, hand, pixelCard);
    planeCanvas.material = frontMaterial;

    const backgroundSphere = BABYLON.MeshBuilder.CreateSphere(
      "mySphere",
      {
        diameter: 100,
        diameterX: 100,
        sideOrientation: BABYLON.Mesh.BACKSIDE,
        arc: 0.5,
      },
      scene
    );
    const backgroundSphereMaterial = new BABYLON.StandardMaterial(
      "MatText",
      scene
    );
    backgroundSphere.rotation.y = BABYLON.Tools.ToRadians(180);
    backgroundSphereMaterial.ambientColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    backgroundSphereMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    backgroundSphere.material = backgroundSphereMaterial;

    // BACK PLANE with TEXT
    const textCanvas = BABYLON.MeshBuilder.CreatePlane(
      "planeCanvas",
      card,
      scene
    );
    textCanvas.position = cardPosition; // move behind front
    const materialText = new BABYLON.StandardMaterial("MatText", scene);
    materialText.ambientColor = new BABYLON.Color3(0.18, 0.18, 0.18);
    materialText.diffuseColor = new BABYLON.Color3(0.18, 0.18, 0.18);
    textCanvas.material = materialText;
    materialText.diffuseTexture = new BABYLON.Texture(textCanvasTexture, scene);

    // small animation text plane
    const smallCard = {
      width: card.width - 3,
      height: 5,
    };
    const smallCardPixel = {
      width: smallCard.width * 60,
      height: smallCard.height * 60,
    };

    const animationTextMaterial = new BABYLON.StandardMaterial("Mat", scene);
    // animationTextMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    animationTextMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
    animationTextMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    // animationTextMaterial.diffuseTexture = dynamicTexture;
    // animationTextCanvas.material = animationTextMaterial;

    // CAMERA
    camera = new BABYLON.ArcRotateCamera(
      "Camera",
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Tools.ToRadians(90),
      25,
      BABYLON.Vector3.Zero(),
      scene
    );
    if (isTouchDevice()) {
      camera.attachControl(canvas, false);
    }
    camera.focusOn([planeCanvas]);
    camera.position = cameraPosition;
    camera.animations = [cameraAnimation];

    hemLight.excludedMeshes.push(backgroundSphere);
    hemLight2.excludedMeshes.push(backgroundSphere);

    initalDone = true;

    return {
      frontMaterial,
      frontTexture,
      frontTextureContext,
      camera,
      smallCardPixel,
      textCanvas,
      whiteSpotLight,
    };
  };

  const getGroundPosition = (scene) => {
    // Use a predicate to get position on the ground
    const pickinfo = scene.pick(scene.pointerX, scene.pointerY);
    return pickinfo.pickedPoint;
  };

  const onSceneMount = (e) => {
    loadFonts();
    let { canvas, scene, engine } = e;
    let {
      frontTexture,
      frontTextureContext,
      camera,
      dynamicTexture,
      smallCardPixel,
      textCanvas,
      whiteSpotLight,
    } = initialSetup(scene, canvas);
    let lastHandPosition = handStartingPosition;

    scene.beginAnimation(camera, 0, 1200, true);

    const cardFlip = async (scene) => {
      if (!flipAnimationIsRunning && !isBack) {
        flipAnimationIsRunning = true;
        const animation = scene.beginDirectAnimation(
          textCanvas,
          [cardFlipRotation, cardFlipPosition],
          0,
          50,
          false
        );
        firstFlipReached = true;
        await animation.waitAsync();
        setTimeout(async () => {
          isBack = true;
          flipAnimationIsRunning = false;
        }, waitDurationBeforeNextFlipTrigger);
      }
    };

    const cardFlipBack = async (scene) => {
      if (!flipAnimationIsRunning && isBack) {
        flipAnimationIsRunning = true;
        const animation = scene.beginDirectAnimation(
          textCanvas,
          [cardFlipBackRotation, cardFlipPosition],
          0,
          50,
          false
        );
        await animation.waitAsync();
        setTimeout(async () => {
          isBack = false;
          flipAnimationIsRunning = false;
        }, waitDurationBeforeNextFlipTrigger);
      }
    };

    const activatetCardFlipFunction = (scene) => {
      if (firstFlipReached) {
        if (isBack) {
          cardFlipBack(scene);
        } else {
          cardFlip(scene);
        }
      }
    };

    const startLightAnimation = (scene) => {
      scene.beginAnimation(whiteSpotLight, 0, 100000, true, 0.01);
    };

    const animateHand = (scene, current) => {
      // console.log(current);
      if (current !== null && firstRenderDone && assetsLoaded) {
        const aimedHandPosition = { x: current.x, y: current.y - 9, z: -2.2 };
        // hand.position = aimedHandPosition
        const tempKeys = [
          { frame: 0, value: lastHandPosition },
          { frame: 3, value: aimedHandPosition },
        ];
        const tempAnimation = new BABYLON.Animation(
          "handTouchAnimation",
          "position",
          5,
          BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        tempAnimation.enableBlending = true;
        tempAnimation.blendingSpeed = 0.5;
        const easingFunction = new BABYLON.QuarticEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        tempAnimation.setEasingFunction(easingFunction);
        tempAnimation.setKeys(tempKeys);

        scene.beginDirectAnimation(
          hand,
          [tempAnimation],
          0,
          3,
          false,
          5,
          (callback) => {}
        );
        lastHandPosition = aimedHandPosition;
      }
    };

    const touchmove = (ev) => {
      ev.preventDefault();
      const x = ev.touches[0].clientX;
      const y = ev.touches[0].clientY;
      const current = getGroundPosition(scene);
      if (current !== null && firstRenderDone && assetsLoaded) {
        animateHand(scene, current);
        if (firstTouch) {
          firstTouch = !firstTouch;
          scene.beginAnimation(hand, 0, 50, true);
        }
        paint(
          frontTextureContext,
          frontTexture,
          cardOutside,
          pixelCard,
          current,
          isTouchDeviceCheck
        );
        movementCounter++;
        activatetCardFlipFunction(scene);
      }
    };

    const pointermove = (ev) => {
      ev.preventDefault();
      const x = ev.clientX;
      const y = ev.clientY;
      const current = getGroundPosition(scene);
      if (current !== null && firstRenderDone && assetsLoaded) {
        animateHand(scene, current);
        if (firstTouch) {
          firstTouch = !firstTouch;
          scene.beginAnimation(hand, 0, 50, true);
        }
        if (isTouchDeviceCheck) {
          paint(
            frontTextureContext,
            frontTexture,
            cardOutside,
            pixelCard,
            current
          );
          activatetCardFlipFunction(scene);
        } else if (ev.buttons > 0) {
          paint(
            frontTextureContext,
            frontTexture,
            cardOutside,
            pixelCard,
            current
          );
          activatetCardFlipFunction(scene);
          movementCounter++;
        }
      }
    };

    let firstTouch = true;
    document.addEventListener("mousemove", (ev) => {
      const current = getGroundPosition(scene);
      animateHand(scene, current);
    });
    document.addEventListener("touchmove", touchmove, false);
    document.addEventListener("pointermove", pointermove);
    firstMountDone = true;

    engine.runRenderLoop(() => {
      if (scene) {
        scene.render();
        if (assetsLoaded && initalDone && firstRenderDone && firstMountDone) {
          loadingCounter++;
          if (loadingCounter === 4) {
            dispatch({ type: "SET_BABYLON_LOADING_DONE" });
            // setLoading(false)
            startLightAnimation(scene);
          } else if (loadingCounter > 4) {
            // show fps in console
            // console.log(engine.getFps().toFixed() + " fps");
            if (
              movementCounter > firstFlipMovementFrame &&
              movementCounter < firstFlipMovementFrame + 20
            ) {
              cardFlip(scene);
            }
          }
        }
        firstRenderDone = true;
      }
    });
  };

  return (
    <div>
      <div className="scene-wrapper">
        <LoadingScreen visible={loading} />
        <BabylonScene
          width={window.innerWidth}
          height={window.innerHeight}
          onSceneMount={onSceneMount}
          className="babylon-scene"
        />
      </div>
    </div>
  );
};

PageWithScene.propTypes = {
  fingerIsTouching: PropTypes.bool,
  fingerPosition: PropTypes.object,
};

export default PageWithScene;
