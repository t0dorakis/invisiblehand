import React, { useContext, useEffect } from "react";
import * as BABYLON from "babylonjs";
import * as HAMMER from 'hammerjs';
import PropTypes from 'prop-types';
import { Store } from '../../Store';
import './Home.scss';


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

    var keys = [];

//At the animation key 0, the value of scaling is "1"
    keys.push({
        frame: 0,
        value: -10
    });

    //At the animation key 20, the value of scaling is "0.2"
    keys.push({
        frame: 25,
        value: -5
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
        frame: 50,
        value: -2.2
    });

    const cameraAnimationKeys = [
        {
            frame:0,
            value: new BABYLON.Vector3(10,-15,-25)
        },
        {
            frame:100,
            value: new BABYLON.Vector3(5,-3,-25)
        },
        {
            frame:200,
            value: new BABYLON.Vector3(-2,5,-25)
        },
        {
            frame:300,
            value: new BABYLON.Vector3(-7,4,-25)
        },
        {
            frame:400,
            value: new BABYLON.Vector3(-1,-3,-25)
        },
        {
            frame:500,
            value: new BABYLON.Vector3(3,-9,-25)
        },
        {
            frame:600,
            value: new BABYLON.Vector3(10,-15,-25)
        }
    ]

    const initialSetup = (scene, canvas) => {



        // SKY
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        scene.clearColor = new BABYLON.Color4(0,0,0,0)
        // var envTexture =‚ new BABYLON.CubeTexture("./assets/skybox.dds", scene);
        // scene.createDefaultSkybox(envTexture, true, 1000);


        handTouchAnimation = new BABYLON.Animation("handTouchAnimation", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        handTouchAnimation.setKeys(keys);


        cameraAnimation = new BABYLON.Animation("cameraAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        cameraAnimation.setKeys(cameraAnimationKeys);



        BABYLON.SceneLoader.ImportMesh("", "./assets/", "scene.babylon", scene, (newMeshes) => {
            assetsLoaded = true
            hand = newMeshes[0]
            const handMaterial = new BABYLON.StandardMaterial("handMat", scene);
            handMaterial.pointsCloud = true;
            handMaterial.diffuseColor = new BABYLON.Color3(0, 0, .5);
            handMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.01, 0.01);


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
        pointLight2.diffuse = new BABYLON.Color3(0, 0, 0.1);
        pointLight2.specular = new BABYLON.Color3(0, 0, 0.2);

        //Light direction is up and left
        const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 5, -8), scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.groundColor = new BABYLON.Color3(1, 1, 1);

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
        const { frontMaterial, texture: frontTexture, frontTextureContext }  = getGroundMaterial(scene)
        planeCanvas.material = frontMaterial;


        // BACK PLANE with TEXT
        const textCanvas = BABYLON.MeshBuilder.CreatePlane("planeCanvas",{width: (22 / (window.innerHeight / window.innerWidth)), height:22}, scene);
        textCanvas.position.z = 3 // move behind front
        const materialText = new BABYLON.StandardMaterial("MatText", scene);
        materialText.ambientColor = new BABYLON.Color3(1, 1, 1);
        materialText.diffuseColor = new BABYLON.Color3(1, 1, 1);

        // Plane behind everything (needed for skybox effect)
        const worldPlane = BABYLON.MeshBuilder.CreatePlane("worldCanvas",{width: (22 / (window.innerHeight / window.innerWidth)), height:22}, scene);

        const gl = new BABYLON.GlowLayer("planeCanvas", scene);

        textCanvas.material = materialText;
        const textureResolution = {width: window.innerWidth, height: window.innerHeight};
        const dynamicTextTexture = new BABYLON.DynamicTexture("dynamic text texture", textureResolution, scene);
        materialText.diffuseTexture = dynamicTextTexture
        var ctx = dynamicTextTexture.getContext();
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "black";
        ctx.font = '50px Helvetica';
        const txt = 'Invisible Hand is an: \nArtist Consultancy\nSuperstar Recruitment';
        const x = 50;
        const y = 300;
        const lineheight = 65;
        const lines = txt.split('\n');
        for (var i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], x, y + (i*lineheight) );
        // ctx.beginPath();
        // ctx.moveTo(75*2, 25*2);
        // ctx.quadraticCurveTo(25*2, 25*2, 25*2, 62.5*2);
        // ctx.quadraticCurveTo(25*2, 100*2, 50*2, 100*2);
        // ctx.quadraticCurveTo(50*2, 120*2, 30*2, 125*2);
        // ctx.fillStyle = "black";
        // ctx.quadraticCurveTo(60*2, 120*2, 65*2, 100*2);
        // ctx.quadraticCurveTo(125*2, 100*2, 125*2, 62.5*2);
        // ctx.quadraticCurveTo(125*2, 25*2, 75*2, 25*2);
        // ctx.fill();
        dynamicTextTexture.update();
        // dynamicTextTexture.drawText('HALLO HALLO HALLO', 0, 0, "bold 44px monospace", 'green', 'white');
        // const textTextureContext = textureText.getContext();
        // textTextureContext.font = "10px Arial";
        // textTextureContext.fillText("Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World", 0, 50);
        // textureText.update()



        // materialGround.diffuseTexture = textureGround;



        return { frontMaterial, frontTexture, frontTextureContext,camera }
    }

    const getGroundMaterial = (scene) => {
        //Create dynamic texture
        const textureResolution = {width: window.innerWidth, height: window.innerHeight};
        const texture = new BABYLON.DynamicTexture("dynamic texture", textureResolution, scene);

        const frontMaterial = new BABYLON.StandardMaterial("Mat", scene);
        frontMaterial.opacityTexture = texture;
        // frontMaterial.bumpTexture = new BABYLON.Texture("./assets/Dust_Fibers_001.jpg", scene);
        // frontMaterial.diffuseTexture = new BABYLON.Texture("./assets/Dust_Fibers_001.jpg", scene);

        frontMaterial.alpha = 0.8;

        // dust alternative
        // frontMaterial.diffuseTexture = new BABYLON.Texture("./assets/Dust_Fibers_001.jpg", scene);
        // frontMaterial.alpha = 0.5;

        frontMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
        frontMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        frontMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        frontMaterial.refractionFresnelParameters = new BABYLON.FresnelParameters();
        frontMaterial.refractionFresnelParameters.bias = 0.5;
        frontMaterial.refractionFresnelParameters.power = 16;
        frontMaterial.refractionFresnelParameters.leftColor = BABYLON.Color3.Black();
        frontMaterial.refractionFresnelParameters.rightColor = BABYLON.Color3.White();

        frontMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        frontMaterial.specularColor = new BABYLON.Color3(1, 0.6, 1);
        // frontMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        frontMaterial.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);

        const frontTextureContext = texture.getContext();

        frontTextureContext.beginPath();
        frontTextureContext.arc(fingerPosition.x, fingerPosition.y, 100, 300, 2 * Math.PI);

        frontTextureContext.fillStyle = "rgba(0, 0, 0, 1)";
        frontTextureContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
        texture.update();

        return { frontMaterial, texture, frontTextureContext }
    }

    const paint = (textureContext, textureGround, fingerPosition, fingerIsTouching) => {
        const radius = 50;
        const x = fingerPosition.x;
        const y = fingerPosition.y;

        const gradient = textureContext.createRadialGradient(x, y, (radius - 10), x, y, (radius + 10));
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        console.log(textureGround)
        textureContext.beginPath();
        textureContext.beginPath();
        textureContext
            .arc(x, y, radius, 0, 2 * Math.PI)
        textureContext.globalCompositeOperation = "destination-out";
        textureContext.strokeStyle = gradient;
        textureContext.fillStyle = gradient;
        textureContext.fill();
        textureContext.closePath();


        textureGround.update();
    }

    var getGroundPosition = function (scene) {
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY);
        return pickinfo.pickedPoint;
    }

    const onSceneMount = (e) => {
        const { canvas, scene, engine } = e;

        const { frontTexture, frontTextureContext, camera  } = initialSetup(scene, canvas)
        scene.beginAnimation(camera, 0, 600, true);
        // hammerjs listens to mouse move
        // Create an instance of Hammer with the reference.
        const hammer = new HAMMER(canvas);

        let firstTouch = true;
        let lastHandPosition = handStartingPosition;
        hammer.on("panleft panright tap press", (ev)=> {
            const current = getGroundPosition(scene);
            console.log(current);
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