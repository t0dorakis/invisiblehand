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

const cardFlipFrameRate = 50;
const cardFlipBackRotationKeys = [
  {
    frame: 0,
    value: {
      y: Math.PI,
      x: 0,
      z: Math.PI / 30
    }
  },
  {
    frame: cardFlipFrameRate / 2,
    value: {
      y: Math.PI / 2,
      x: 0,
      z: Math.PI / 15
    }
  },
  {
    frame: cardFlipFrameRate,
    value: {
      y: 0,
      x: 0,
      z: 0
    }
  }
];
const cardFlipRotationKeys = [
  {
    frame: 0,
    value: {
      y: 0,
      x: 0,
      z: 0
    }
  },
  {
    frame: cardFlipFrameRate / 2,
    value: {
      y: Math.PI / 2,
      x: 0,
      z: Math.PI / 15
    }
  },
  {
    frame: cardFlipFrameRate,
    value: {
      y: Math.PI,
      x: 0,
      z: Math.PI / 30
    }
  },
];

const cardFlipRotation = new BABYLON.Animation("cardFlipRotation", "rotation", cardFlipFrameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)
cardFlipRotation.setKeys(cardFlipRotationKeys);
const cardFlipBackRotation = new BABYLON.Animation("cardFlipBackRotation", "rotation", cardFlipFrameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)
cardFlipBackRotation.setKeys(cardFlipBackRotationKeys);

const cardFlipPositionKeys = [
  {
    frame: 0,
    value: 3
  },
  {
    frame: cardFlipFrameRate / 2,
    value: 10
  },
  {
    frame: cardFlipFrameRate,
    value: 3
  }
];

const cardFlipPosition = new BABYLON.Animation("cardFlipPosition", "position.z", cardFlipFrameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT)


const lightAnimationFramerate = 500;
let alpha = 0;

const lightAnimationPositionKeys = [];

for (var i = 0; i < lightAnimationFramerate; i++){
  var x = 10 * Math.cos(alpha);
  var y = 16 * Math.sin(alpha);
  var z = -30;

  lightAnimationPositionKeys.push({
    frame: i,
    value: new BABYLON.Vector3(x, y, z)
  });

  alpha += 0.1;
}

const lightAnimationPosition = new BABYLON.Animation("lightAnimationX", "position", lightAnimationFramerate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)

lightAnimationPosition.setKeys(lightAnimationPositionKeys);

const lightAnimationArray = [lightAnimationPosition]

cardFlipPosition.setKeys(cardFlipPositionKeys);

export { lightAnimationArray, cardFlipRotation, cardFlipPosition, cardFlipBackRotation }

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