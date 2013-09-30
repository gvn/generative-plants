function draw() {

  // priveleged vars
  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cWidth = canvas.width,
    cHeight = canvas.height,
    avgSegments = 32,
    segmentVariability = 2, // max number possible + or - branch segments
    maxBranches = 2,
    startLineWidth = 14,
    startingBranchProbability = 0.6, // a decimal between 0-1 to indicate probability of another branch starting from the same point
    branchProbabilityReductionRate = 0.92, // how fast the probability reduces toward the end of a branch
    maxBerriesPerSegment = 4,
    berryWidth = 3;

  // event handlers
  document.getElementById('regenerateTree').addEventListener('click', function (e) {
    e.preventDefault();
    regenerate();
  });

  // setup
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = startLineWidth;
  ctx.translate(cWidth / 2, cHeight);

  branch(avgSegments, 0, startingBranchProbability, 2, berryWidth);

  function branch(segments, branches, branchProbability, berryProbability, berrySize) {
    var segmentVariation = randomNumberInRange(0, segmentVariability, true),
      segmentLength = randomNumberInRange(-130, -120, false);

    ctx.save();
    ctx.rotate(randomAngle(10, 27, true));
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(0, segmentLength);
    ctx.translate(0, segmentLength);
    ctx.stroke();

    // berries
    // only add berries on upper half of branches
    if (segments <= avgSegments / 2) {
      ctx.beginPath();

      ctx.arc(
        randomNumberInRange(startLineWidth, startLineWidth + 5, true),
        randomNumberInRange(segmentLength / 2, segmentLength, false),
        berrySize,
        0,
        2 * Math.PI,
        false);

      ctx.fill();
    }

    segments--;

    // recursively call next branch segment
    if (segments + segmentVariation > 0) {
      ctx.scale(0.9, 0.9);

      // next will branch randomly within maxBranch number of times.
      // Berry size needs to incrementally increase to compensate for segment size shrink
      branch(segments, maxBranches, branchProbability * branchProbabilityReductionRate, 2, berrySize * 1.08);
    }

    ctx.restore();

    branches--;

    // start another branch from last saved coordinate
    if (branches > 0 && Math.random() <= branchProbability) {
      branch(segments, branches, branchProbability, 2, berrySize);
    }
  }

  function regenerate() {
    // im feeling lazy and didnt feel like caching the dom elements as vars
    avgSegments = parseInt(document.getElementById('avgSegments').value, 10);
    segmentVariability = parseInt(document.getElementById('segmentVariability').value, 10);
    maxBranches = parseInt(document.getElementById('maxBranches').value, 10);
    startLineWidth = parseInt(document.getElementById('startLineWidth').value, 10);
    startingBranchProbability = parseFloat(document.getElementById('startingBranchProbability').value, 10);
    branchProbabilityReductionRate = parseFloat(document.getElementById('branchProbabilityReductionRate').value, 10);
    maxBerriesPerSegment = parseInt(document.getElementById('maxBerriesPerSegment').value, 10);
    berryWidth = parseInt(document.getElementById('berryWidth').value, 10);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.translate(cWidth / 2, cHeight);
    ctx.lineWidth = startLineWidth;

    branch(avgSegments, 0, startingBranchProbability, 2, berryWidth);
  }

  // generate randomized number, where number is a number between $min and $max,
  // and plusOrMinus is a boolean indicating if that number can be positive or negative
  function randomNumberInRange(min, max, plusOrMinus) {
    var variation = Math.random() * (max - min),
      randomNumber = max - variation,
      posNeg = 1;

    if (plusOrMinus) {
      posNeg = Math.random();
      posNeg = posNeg <= 0.5 ? 1 : -1;
    }

    return Math.random() * (randomNumber * posNeg);
  }

  // canvas rotates using radians, so output result of randomNumberInRange in radians
  function randomAngle(min, max, plusOrMinus) {
    return Math.PI / (180 / randomNumberInRange(min, max, plusOrMinus));
  }

}
