import * as BABYLON from "babylonjs";


export const cameraAnimationKeys = [
    {
        frame:0,
        value: new BABYLON.Vector3(10,-15,-25)
    },
    {
        frame:200,
        value: new BABYLON.Vector3(9,-12,-25)
    },
    {
        frame:400,
        value: new BABYLON.Vector3(8,-9,-25)
    },
    {
        frame:600,
        value: new BABYLON.Vector3(6,-11,-25)
    },
    {
        frame:800,
        value: new BABYLON.Vector3(8,-12,-25)
    },
    {
        frame:1000,
        value: new BABYLON.Vector3(10,-13,-25)
    },
    {
        frame:1200,
        value: new BABYLON.Vector3(10,-15,-25)
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