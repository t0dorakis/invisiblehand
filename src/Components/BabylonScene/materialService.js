import * as BABYLON from "babylonjs";
import fingerprintMap from '../../assets/maps/fingerprints.jpg';


export const getGroundMaterial = (scene, reflectionMesh) => {
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

    // refrection not working in IOS! At least it seems like.

    // frontMaterial.refractionFresnelParameters = new BABYLON.FresnelParameters();
    // frontMaterial.refractionFresnelParameters.bias = 0.5;
    // frontMaterial.refractionFresnelParameters.power = 16;
    // frontMaterial.refractionFresnelParameters.leftColor = BABYLON.Color3.Black();
    // frontMaterial.refractionFresnelParameters.rightColor = BABYLON.Color3.White();

    frontMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    frontMaterial.specularColor = new BABYLON.Color3(1, 0.6, 1);
    // frontMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    frontMaterial.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    // frontMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", {ratio: 0.5}, scene, true);
    // frontMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -2.0);
    // frontMaterial.reflectionTexture.renderList = [reflectionMesh];
    // frontMaterial.reflectionTexture.level = 5;
    // frontMaterial.reflectionTexture.adaptiveBlurKernel = 32;

    frontMaterial.specularTexture = new BABYLON.Texture(fingerprintMap, scene);
    frontMaterial.specularPower = 64;
    frontMaterial.useGlossinessFromSpecularMapAlpha = true;
    // frontMaterial.diffuseColor = BABYLON.Color3.Black();
    frontMaterial.roughness = 3;

    // paint black
    const frontTextureContext = texture.getContext();
    frontTextureContext.beginPath();
    frontTextureContext.fillStyle = "rgba(0, 0, 0, 1)";
    frontTextureContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    texture.update();

    return { frontMaterial, texture, frontTextureContext }
}