import * as BABYLON from "babylonjs";

const deviceIsDesktop = window.innerWidth > 600
const cameraZ = deviceIsDesktop ? -40 : -25

export const cameraPosition = new BABYLON.Vector3(0,1,cameraZ)

export const cameraAnimationKeys = [
    {
        frame:0,
        value: cameraPosition
    },
    {
        frame:200,
        value: new BABYLON.Vector3(-5,+5,cameraZ)
    },
    {
        frame:400,
        value: new BABYLON.Vector3(-3, +5,cameraZ)
    },
    {
        frame:600,
        value: new BABYLON.Vector3(-5,+3,cameraZ)
    },
    {
        frame:800,
        value: new BABYLON.Vector3(-3,+2,cameraZ)
    },
    {
        frame:1000,
        value: new BABYLON.Vector3(-1,2,cameraZ)
    },
    {
        frame:1200,
        value: cameraPosition
    }
]

export const handAnimationKeys = [
    {
        frame: 0,
        value: -10
    },
    {
        frame: 25,
        value: -5
    },
    {
        frame: 50,
        value: -2.2
    }
];