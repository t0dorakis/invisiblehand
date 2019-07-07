import * as BABYLON from "babylonjs";


export const cameraAnimationKeys = [
    {
        frame:0,
        value: new BABYLON.Vector3(0,1,-25)
    },
    {
        frame:200,
        value: new BABYLON.Vector3(-5,+5,-25)
    },
    {
        frame:400,
        value: new BABYLON.Vector3(-3, +5,-25)
    },
    {
        frame:600,
        value: new BABYLON.Vector3(-5,+3,-25)
    },
    {
        frame:800,
        value: new BABYLON.Vector3(-3,+2,-25)
    },
    {
        frame:1000,
        value: new BABYLON.Vector3(-1,2,-25)
    },
    {
        frame:1200,
        value: new BABYLON.Vector3(0,1,-25)
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