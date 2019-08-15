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
const cardFlipRotationYKeys = [
  {
    frame: 0,
    value: 0
  },
  {
    frame: cardFlipFrameRate / 2,
    value: Math.PI / 2
  },
  {
    frame: cardFlipFrameRate,
    value:  Math.PI
  }
];
const cardFlipRotationY = new BABYLON.Animation("cardFlipRotationY", "rotation.y", cardFlipFrameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT)
cardFlipRotationY.setKeys(cardFlipRotationYKeys);
const cardFlipRotationZKeys = [
  {
    frame: 0,
    value: 0
  },
  {
    frame: cardFlipFrameRate / 2,
    value: Math.PI / 15
  },
  {
    frame: cardFlipFrameRate,
    value: Math.PI / 30
  }
];
const cardFlipRotationZ = new BABYLON.Animation("cardFlipRotationY", "rotation.z", cardFlipFrameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT)
cardFlipRotationZ.setKeys(cardFlipRotationZKeys);

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


const lightAnimationFramerate = 10000;
const lightAnimationXKeys = [
  {
    frame: 0,
    value: -20
  },
  {
    frame: lightAnimationFramerate / 4,
    value: -10
  },
  {
    frame: (lightAnimationFramerate / 4) * 2,
    value: 0
  },
  {
    frame: (lightAnimationFramerate / 4) * 3,
    value: 10
  },
  {
    frame: lightAnimationFramerate,
    value: 20
  }
];
const lightAnimationYKeys = [
  {
    frame: 0,
    value: -20
  },
  {
    frame: lightAnimationFramerate / 4,
    value: -10
  },
  {
    frame: (lightAnimationFramerate / 4) * 2,
    value: 0
  },
  {
    frame: (lightAnimationFramerate / 4) * 3,
    value: 10
  },
  {
    frame: lightAnimationFramerate,
    value: 20
  }
];
const lightAnimationXRotationKeys = [
  {
    frame: 0,
    value: Math.PI / 4
  },
  {
    frame: lightAnimationFramerate / 4,
    value: Math.PI / 2
  },
  {
    frame: (lightAnimationFramerate / 4) * 2,
    value: 0
  },
  {
    frame: (lightAnimationFramerate / 4) * 3,
    value: 0.1
  },
  {
    frame: lightAnimationFramerate,
    value: 0.2
  }
];
const lightAnimationX = new BABYLON.Animation("lightAnimationX", "position.x", lightAnimationFramerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
const lightAnimationY = new BABYLON.Animation("lightAnimationY", "position.y", lightAnimationFramerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
const lightAnimationXRotation = new BABYLON.Animation("lightAnimationXRotation", "direction.x", lightAnimationFramerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
lightAnimationX.setKeys(lightAnimationXKeys);
lightAnimationY.setKeys(lightAnimationYKeys);
lightAnimationXRotation.setKeys(lightAnimationXRotationKeys);


const lightAnimationArray = [lightAnimationX, lightAnimationY]

cardFlipPosition.setKeys(cardFlipPositionKeys);

export { lightAnimationArray, cardFlipRotationY, cardFlipRotationZ, cardFlipPosition }

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