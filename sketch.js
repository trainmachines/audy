
// Video, PoseNet, and Sound


//Declare variables
let video;
let poseNet;
let poses = [];

// Neural Network
let neuralNetwork;

// Interface
let add_dataButton;
let save_dataButton;
let save_modelButton;
let dataLabel;
let trainButton;
let classificationP;
//let save_dataModel;
//let save_Model

//Adding to find a solution
let model;
let targetLabel = 'A';
// let trainingData = [];

let state = 'collection';

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
  F: 349.2282,
  G: 391.9954,
  A: 440.0,
  B: 493.8833,
};

let env, wave;
let skeleton;
let frequency;



//add to enables saving data by pressing s and save model by pressing m (this was working but now it is not)
function keyPressed() {

  if (key == 's') {
    model.saveData('audy');
  } else if (key == 'm') {
    model.save();
  } else {
    targetLabel = key.toUpperCase();
  }
}

//setup
function setup() {
  createCanvas(530, 370);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });

  // Hide the video element and just show the canvas
  video.hide();

  classificationP = createP('Waiting for you to train a custom model');

  // The interface
  dataLabel = createSelect();
  dataLabel.option('A');
  dataLabel.option('B');
  dataLabel.option('C');
  dataLabel.option('D');
  dataLabel.option('E');
  dataLabel.option('F');
  dataLabel.option('G');

  add_dataButton = createButton('add data');
  add_dataButton.mousePressed(addExample);

  trainButton = createButton('train model');
  trainButton.mousePressed(trainModel);

  save_dataButton = createButton('save data');
  save_dataButton.mousePressed(save_dataModel);

  save_modelButton = createButton('save model');
  save_modelButton.mousePressed(save_Model);

  // Create the model
  const options = {
    inputs: 34,
    outputs: 7,
    task: 'classification',
    debug: true
  }
  neuralNetwork = ml5.neuralNetwork(options);
  //model.loadData('model.json');
  //model.load('        ');

  //        Load model pointing to each file
/*  const modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  }
  neuralNetwork.load(modelDetails, modelReady);*/
}

//create a frequency class that could play variations
/*class Frequency {
  constructor() {
    this.x = 500;
    this.y = 175;
  }

  volume() {
    play(img3,
        this.x,
        this.y,
        100,
        100);
  }
}*/


// Train the model while normalizing
function trainModel() {
  neuralNetwork.normalizeData();
  const options = {
    epochs: 30
  }
  neuralNetwork.train(options, finishedTraining);
}

// save data model
function save_dataModel() {

}

// save the model
function save_Model() {

}

//added to see epochs while training if possible
function whileTraining(epoch, loss) {
  console.log(epoch);
}

// Begin prediction
function finishedTraining() {
  classify();
}

// Classify
function classify() {
  if (poses.length > 0) {
    const inputs = getInputs();
    neuralNetwork.classify(inputs, gotResults);
  }
}

function gotResults(error, results) {
  //  Log output
  // console.log(results);
/*  if (error) {
    console.error(error);
    return;
  }
  console.log(results);*/
  classificationP.html(`${results[0].label} (${floor(results[0].confidence * 100)})%`);
  // Classify again
  classify();
}

function getInputs() {
  const keypoints = poses[0].pose.keypoints;
  const inputs = [];
  for (let i = 0; i < keypoints.length; i += 1) {
    inputs.push(keypoints[i].position.x);
    inputs.push(keypoints[i].position.y);
  }
  return inputs;
}

//  Add a training example
function addExample() {
  if (poses.length > 0) {
    const inputs = getInputs();
    const target = dataLabel.value();
    neuralNetwork.addData(inputs, [target]);
  }
}

// PoseNet ready
function modelReady() {
  console.log('model loaded');
}

// Draw PoseNet
function draw() {
  image(video, 0, 0, width, height);
  strokeWeight(2);
  // For one pose only (could use a for loop with multiple poses)s
  if (poses.length > 0) {
    const pose = poses[0].pose;
    for (let i = 0; i < pose.keypoints.length; i += 1) {
      fill(213, 0, 143);
      noStroke();
      ellipse(pose.keypoints[i].position.x, pose.keypoints[i].position.y, 8);
    }
  }
}
