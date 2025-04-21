// Source for the split leverless models
// It's a big mess, but it works and can be modified somewhat easily
const { draw, makePlane, makeCylinder, drawCircle, drawPolysides, drawRectangle, combineFinderFilters, EdgeFinder } = replicad;

const getNutHole = (holeLength) => {
  const profile = drawPolysides(5, 6);
  const nut = profile.sketchOnPlane().extrude(-5);
  const boltProfile = drawCircle(2.75);
  const boltHole = boltProfile.sketchOnPlane().extrude(-(holeLength * 2 + 5)).translateZ(holeLength);
  return nut.fuse(boltHole);
}

const createUpperBase = (width, height) => {
  const rect = drawRectangle(width, height);
  const box = rect
    .fillet(15)
    .sketchOnPlane("XY")
    .extrude(18.25);

  const [filters] = combineFinderFilters([
    {
      filter: new EdgeFinder().inPlane("XY"),
      radius: 2
    }
  ])

  const filletBox = box.chamfer(filters);

  const holeOffsetX = width / 2 - 10;
  const holeOffsetY = height / 2 - 10;
  const depth = 13

  const boxWithHoles = filletBox
    .cut(getNutHole(6).translate([holeOffsetX, holeOffsetY, depth]))
    .cut(getNutHole(6).translate([-holeOffsetX, holeOffsetY, depth]))
    .cut(getNutHole(6).translate([holeOffsetX, -holeOffsetY, depth]))
    .cut(getNutHole(6).translate([-holeOffsetX, -holeOffsetY, depth]))

  const innerOffsetX = width - 32;
  const innerOffsetY = height - 32;
  const cornerOffset = 14;

  const innerCut = draw([0, height / 2 - 2])
    .hLine(width / 2 - 16)
    .vLine(-cornerOffset)
    .hLine(cornerOffset)
    .vLine(-innerOffsetY)
    .hLine(-cornerOffset)
    .vLine(-cornerOffset)
    .hLine(-innerOffsetX)
    .vLine(cornerOffset)
    .hLine(-cornerOffset)
    .vLine(innerOffsetY)
    .hLine(cornerOffset)
    .vLine(cornerOffset)
    .close()
    .sketchOnPlane();

  const innerCutShape = innerCut.extrude(-15.25).translateZ(18.25)

  const cutBox = boxWithHoles.cut(innerCutShape);

  return cutBox.mirror("XY");
}

const getLidHole = (innerDiam, outerDiam) => {
  const outer = drawCircle(outerDiam / 2).sketchOnPlane().extrude(-4);
  const inner = drawCircle(innerDiam / 2).sketchOnPlane().extrude(-6);
  return inner.fuse(outer);
}

const createLowerBase = (width, height) => {
  const rect = drawRectangle(width, height);
  const box = rect
    .fillet(15)
    .sketchOnPlane("XY")
    .extrude(6);

  const [filters] = combineFinderFilters([
    {
      filter: new EdgeFinder().inPlane("XY", 6),
      radius: 2
    }
  ])

  const filletBox = box.chamfer(filters);

  const holeOffsetX = width / 2 - 10;
  const holeOffsetY = height / 2 - 10;

  const boxWithHoles = filletBox
    .cut(getLidHole(5.5, 9).translate([holeOffsetX, holeOffsetY, 6]))
    .cut(getLidHole(5.5, 9).translate([-holeOffsetX, holeOffsetY, 6]))
    .cut(getLidHole(5.5, 9).translate([holeOffsetX, -holeOffsetY, 6]))
    .cut(getLidHole(5.5, 9).translate([-holeOffsetX, -holeOffsetY, 6]))

  return boxWithHoles.mirror("XY");
}

const createButtonHolster = () => {
  const base = drawCircle(16);
  const baseShape = base.sketchOnPlane().extrude(7);

  const circleHole = drawCircle(14);
  const circleHoleShape = circleHole.sketchOnPlane().extrude(5).translateZ(2);
  const holedBase = baseShape.cut(circleHoleShape);

  const squareHole = drawRectangle(14, 14);
  const squareHoleShape = squareHole.sketchOnPlane().extrude(2);

  return holedBase.cut(squareHoleShape);
}

const addButton = (base, xOffset, yOffset, zOffset) => {
  const hole = drawCircle(16)
  const holeShape = hole.sketchOnPlane().extrude(7).translate(xOffset, yOffset, zOffset)

  const holedBase = base.cut(holeShape);

  const buttonHolster = createButtonHolster().translate(xOffset, yOffset, zOffset);

  return holedBase.fuse(buttonHolster);
}

const create6By6Hole = () => {
  const outer = drawRectangle(6.5, 6.5);
  const outerShape = outer.sketchOnPlane().extrude(3);
  
  const inner = drawCircle(2);
  const innerShape = inner.sketchOnPlane().extrude(5);

  return outerShape.fuse(innerShape)
}

const add6By6Hole = (base, xOffset, yOffset, zOffset) => {
  const holeShape = create6By6Hole().translate(xOffset, yOffset, zOffset);
  return base.cut(holeShape);
}

const createUsbC = () => {
  const base = drawRectangle(13.5, 7.5)
  const baseShape = base.sketchOnPlane("XZ").extrude(5);


  const hole = draw()
    .hLine(6)
    .halfEllipse(0, 3.5, 1.75, true)
    .hLine(-6)
    .halfEllipse(0, -3.5, 1.75, true)
    .close();

  const holeShape = hole
    .sketchOnPlane("XZ")
    .extrude(5)
    .translate(-3, 0, -1.75);

  const bottom = drawRectangle(13.5, 15.5);
  const bottomShape = bottom
    .sketchOnPlane()
    .extrude(3.75)

  const bottomHole = drawRectangle(9.5, 13.5);
  const bottomHoleShape = bottomHole
    .sketchOnPlane()
    .extrude(1.75)
    .translateZ(2)

  const bottomBucketShape = bottomShape
    .cut(bottomHoleShape)
    .translate(0, 2.75, -3.75);

  const baseWithBucket = baseShape.fuse(bottomBucketShape);

  const baseWithHole = baseWithBucket.cut(holeShape);

  return baseWithHole;
}

const addUsbC = (base, xOffset, yOffset, zOffset, rotation) => {
  const hole = drawRectangle(13.5, 15.5)
  const holeShape = hole.sketchOnPlane().extrude(7.5)
    .rotate(rotation)
    .translate(xOffset, yOffset, zOffset);

  const holedBase = base.cut(holeShape);

  const usbCShape = createUsbC()
    .translateY(-2.75)
    .mirror("XY")
    .rotate(rotation)
    .translate(xOffset, yOffset, zOffset+3.75);

  let combinedBase = holedBase.fuse(usbCShape); 

  if (zOffset < -10.5) {
    const filler = drawRectangle(13.5, 15.5)
    const fillerShape = filler.sketchOnPlane().extrude(-zOffset - 10.5)
      .mirror("XY")
      .rotate(rotation)
      .translate(xOffset, yOffset, -3);

    return combinedBase.fuse(fillerShape)
  }

  return combinedBase
}

const createLeg = () => {
  const base = drawCircle(0.75)
  const baseShape = base.sketchOnPlane().extrude(8)
  return baseShape
}

const createScreen = () => {
  const base = drawRectangle(30, 30)
  const baseShape = base.sketchOnPlane().extrude(2)

  const legOffsetX = 11;
  const legOffsetY = 10.75;

  const baseWithPegs = baseShape
    .fuse(createLeg().translate(legOffsetX, legOffsetY))
    .fuse(createLeg().translate(-legOffsetX, legOffsetY))
    .fuse(createLeg().translate(legOffsetX, -legOffsetY))
    .fuse(createLeg().translate(-legOffsetX, -legOffsetY))

  const hole = drawRectangle(25, 13.5);
  const holeShape = hole.sketchOnPlane().extrude(2);

  const baseWithHole = baseWithPegs
    .cut(holeShape.translateY(1.15))
    .chamfer(1.75, e => e.and([
      f => f.inBox([12.50, 7.90, 0], [-12.51, -5.61, 0.1]),
      f => f.inPlane("XY")
    ]))

  return baseWithHole;
}

const addScreen = (base, xOffset, yOffset, zOffset) => {
  const hole = drawRectangle(30, 30);
  const holeShape = hole.sketchOnPlane().extrude(11)
    .mirror("XY")
    .translate(xOffset, yOffset, zOffset);

  const holedBase = base.cut(holeShape);

  const screenShape = createScreen()
    .mirror("XY")
    .translate(xOffset, yOffset, zOffset);

  let combinedBase = holedBase.fuse(screenShape);

  return combinedBase;
}

const createRPLeg = () => {
  const base = drawCircle(0.75)
  const baseShape = base.sketchOnPlane().extrude(4)
  return baseShape
}

const createRP2040 = () => {
  const base = drawRectangle(16, 51.8)
  const baseShape = base.sketchOnPlane().extrude(2)

  const legOffsetX = 5.5;
  const legOffsetY = 23.6;

  const baseWithPegs = baseShape
    .fuse(createRPLeg().translate(legOffsetX, legOffsetY))
    .fuse(createRPLeg().translate(-legOffsetX, legOffsetY))
    .fuse(createRPLeg().translate(legOffsetX, -legOffsetY))
    .fuse(createRPLeg().translate(-legOffsetX, -legOffsetY))

  return baseWithPegs;
}

const addRP2040 = (base, xOffset, yOffset, zOffset, rotation) => {
  const rpShape = createRP2040()
    .mirror("XY")
    .rotate(rotation)
    .translate(xOffset, yOffset, zOffset);

  const combinedBase = base.fuse(rpShape);
  return combinedBase; 
}

const createEthernetUpper = () => {
  const top = drawRectangle(20.25, 20.5);  
  const topShape = top
    .sketchOnPlane()
    .extrude(16.25)

  const topHole = drawRectangle(18.5, 16.5);
  const topHoleShape = topHole
    .sketchOnPlane()
    .extrude(14.25)
    .translate(1, 0, 2)

  const topHole2 = drawRectangle(20.25, 14.5);
  const topHoleShape2 = topHole2
    .sketchOnPlane()
    .extrude(9)
    .translate(0, 0, 7.25)

  const topBucketShape = topShape
    .cut(topHoleShape)
    .cut(topHoleShape2);
  
  return topBucketShape;
}

const addEthernetUpper = (base, xOffset, yOffset, zOffset, rotation) => {
  const hole = drawRectangle(20.25, 20.5)
  const holeShape = hole
    .sketchOnPlane()
    .extrude(16.25)
    .mirror("XY")
    .rotate(rotation)
    .translate(xOffset, yOffset, zOffset);

  const holedBase = base.cut(holeShape);
  const ethernetShape = createEthernetUpper()
    .mirror("XY")
    .rotate(rotation)
    .translate(xOffset, yOffset, zOffset);

  const combinedBase = holedBase.fuse(ethernetShape);
  return combinedBase; 
}

const createEthernetLower = () => {
  const bottom = drawRectangle(20.25, 20.5);
  const bottomShape = bottom
    .sketchOnPlane()
    .extrude(5.5)

  const bottomHole = drawRectangle(16.5, 16.5);
  const bottomHoleShape = bottomHole
    .sketchOnPlane()
    .extrude(4.25)
    .translateZ(2)

  const bottomBucketShape = bottomShape
    .cut(bottomHoleShape);

  const frontHole = drawRectangle(2.5, 10);
  const frontHoleShape = frontHole
    .sketchOnPlane()
    .extrude(4.5)
    .translate(9, 0, 2)

  const bottomWithHole = bottomHoleShape
    .fuse(frontHoleShape);

  return bottomWithHole;
}

const addEthernetLower = (base, xOffset, yOffset, zOffset, rotation) => {
  const ethernetShape = createEthernetLower()
    .rotate(rotation)
    .translate(xOffset, yOffset, zOffset);

  const combinedBase = base.cut(ethernetShape);
  return combinedBase; 
}

const getRightUpper = () => {
  let rightUpperHalf = createUpperBase(185, 220);

  let buttonOffsetX = -41.5;
  let buttonOffsetY = 30;
  let buttonScale = 0.9;
  let buttonPositions = [
    [0, 0],
    [7, 38.5],
    [33, 14],
    [33+7, 14+38.5],
    [33+36, 14-6],
    [33+36+6.5, 14-6+38.5],
    [33+36+34, 14-6-15],
    [33+36+34+6.5, 14-6-15+38.5],
    [-17, -45],
  ]

  buttonPositions.forEach(([x, y]) => {
    rightUpperHalf = addButton(rightUpperHalf, (x * buttonScale) + buttonOffsetX, (y * buttonScale) + buttonOffsetY, -7)
  })

  rightUpperHalf = add6By6Hole(rightUpperHalf, 65, 95, -4);
  rightUpperHalf = add6By6Hole(rightUpperHalf, 55, 95, -4);
  rightUpperHalf = add6By6Hole(rightUpperHalf, 45, 95, -4);

  rightUpperHalf = addScreen(rightUpperHalf, -60, 90);
  rightUpperHalf = addRP2040(rightUpperHalf, 0, -35, -2, 90);
  rightUpperHalf = addUsbC(rightUpperHalf, -32.25, 102.25, -17, 180);
  rightUpperHalf = addEthernetUpper(rightUpperHalf, -82.375, 30, -2, 0);

  return rightUpperHalf;
}

const getRightLower = () => {
  let rightLowerHalf = createLowerBase(185, 220).translateZ(-18.25);
  rightLowerHalf = addEthernetLower(rightLowerHalf, -82.375, 30, -23.5, 180);

  return rightLowerHalf;
}

const getLeftUpper = () => {
  let leftUpperHalf = createUpperBase(135, 220);

  let buttonOffsetX = -32;
  let buttonOffsetY = 55;
  let buttonScale = 1;
  let buttonPositions = [
    [0, 0],
    [31.5, 0],
    [26.5+31.5, -16.5],
    [26.5+29.5+12, -16.5-49],
  ]

  buttonPositions.forEach(([x, y]) => {
    leftUpperHalf = addButton(leftUpperHalf, (x * buttonScale) + buttonOffsetX, (y * buttonScale) + buttonOffsetY, -7)
  })

  leftUpperHalf = add6By6Hole(leftUpperHalf, -20, 95, -4);
  leftUpperHalf = add6By6Hole(leftUpperHalf, -30, 95, -4);
  leftUpperHalf = add6By6Hole(leftUpperHalf, -40, 95, -4);

  leftUpperHalf = addEthernetUpper(leftUpperHalf, 57.375, 30, -2, 180);

  return leftUpperHalf;
}

const getLeftLower = () => {
  let leftLowerHalf = createLowerBase(135, 220).translateZ(-18.25);
  leftLowerHalf = addEthernetLower(leftLowerHalf, 57.375, 30, -23.5, 0);

  return leftLowerHalf;
}

const main = () => {
  return [
    {
      shape: getRightUpper().translate(200, 0, 0),
      opacity: 0.8
    },
    {
      shape: getRightLower().translate(200, 0, 0),
      opacity: 0.8
    },
    {
      shape: getLeftUpper(),
      opacity: 0.8
    },
    {
      shape: getLeftLower(),
      opacity: 0.8
    }
  ]
};