import * as BABYLON from "babylonjs";
import * as BabylonMaterials from  'babylonjs-materials'

import fingerprintMap from '../../assets/maps/fingerprints.jpg';

export const Materials = {
 getGroundMaterial: (scene, reflectionMesh, pixelCard) => {
     //Create dynamic texture
     const textureResolution = pixelCard;
     const texture = new BABYLON.DynamicTexture("dynamic texture", textureResolution, scene);

     const frontMaterial = new BABYLON.StandardMaterial("Mat", scene);
     frontMaterial.opacityTexture = texture;
     // frontMaterial.bumpTexture = new BABYLON.Texture("./assets/Dust_Fibers_001.jpg", scene);
     // frontMaterial.diffuseTexture = new BABYLON.Texture("./assets/Dust_Fibers_001.jpg", scene);

     frontMaterial.alpha = 0.96;

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
     frontMaterial.roughness = 0;

     // paint black
     const frontTextureContext = texture.getContext();
     frontTextureContext.beginPath();
     frontTextureContext.fillStyle = "rgba(0, 0, 0, 1)";
     frontTextureContext.fillRect(0, 0, textureResolution.width, textureResolution.height);
     texture.update();

     return {frontMaterial, texture, frontTextureContext}
 },
    createWaterMaterial: (name, type, scene, waterBumpTexture, ) => {
        const waterMaterial = new BabylonMaterials.WaterMaterial(name, scene);
        waterMaterial.bumpTexture = new BABYLON.Texture(waterBumpTexture, scene);
        // waterMaterial.backFaceCulling = true;

        if (type === 'plane') {
            waterMaterial.windForce = -15;
            waterMaterial.waveHeight = 0;
            waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
            waterMaterial.waterColor = new BABYLON.Color3(1, 0, 0);
            waterMaterial.colorBlendFactor = 0;
            waterMaterial.bumpHeight = 0.1;
            waterMaterial.waveLength = 0.8;
        } else if (type === 'sphere') {
            waterMaterial.windForce = 5;
            waterMaterial.waveHeight = 0.3;
            waterMaterial.bumpHeight = 3;
            waterMaterial.waveLength = 0.5;
            waterMaterial.waterColor = new BABYLON.Color3(0.1, 0.1, 0.3);
            waterMaterial.colorBlendFactor = 0.5;
            waterMaterial.alpha = 0.9;
        }

        // Water properties
        return waterMaterial
    },
    createSkyboxMaterial: (name, scene, texture ) => {
        const skyboxMaterial = new BABYLON.StandardMaterial(name, scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(texture, scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(1, 0, 0);
        skyboxMaterial.disableLighting = false;
        return skyboxMaterial
    },
    createGlassMaterial: (name, scene, texture) => {
        const glass = new BABYLON.PBRMaterial(name, scene);
        glass.reflectionTexture = texture;
        glass.indexOfRefraction = 3;
        glass.alpha = 0.7;
        glass.directIntensity = 0.0;
        glass.environmentIntensity = 0.7;
        glass.cameraExposure = 0.66;
        glass.cameraContrast = 1.66;
        glass.microSurface = 1;
        glass.reflectivityColor = new BABYLON.Color3(0.2, 0.4, 0.2);
        glass.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
        return glass
    }
}
