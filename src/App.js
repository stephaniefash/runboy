import React, { useEffect, useState } from "react";
import "./App.css";
import * as THREE from "three";
import { Stopwatch } from "./helper/ScoreCounter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function App() {
  const pastelCream = "#f1e6c4";
  const ARROW_UP = "ArrowUp";
  const ARROW_LEFT = "ArrowLeft";
  const ARROW_RIGHT = "ArrowRight";
  const CAMERA_Z_COORDINATE = 1200;
  const width = window.innerWidth - 300;
  const path = "http://192.168.1.222:8000";
  const horsePath = `${path}/src/models/Horse.glb`;
  const snakePath = `${path}/src/models/model_31a_-_timber_rattlesnake/scene.gltf`;
  const elephantPath = `${path}/src/models/elephant_cycle/scene.gltf`;
  const lowerXRange = -3;
  const higherXRange = 3;
  const lowerZRange = -100000;
  const higherZRange = 1000;

  let scene, camera, renderer, direction, mixer, mesh;
  let mixerGroup = [];
  let loader = new GLTFLoader();
  let clock = new THREE.Clock();

  function init() {
    scene = new THREE.Scene();
    addFogToScene();

    scene.background = new THREE.Color(pastelCream);
    let container = document.getElementById("container");
    document.onkeydown = setDirectionOnEventKeyPress;

    camera = new THREE.PerspectiveCamera(
      1,
      width / window.innerHeight,
      0.01,
      1000
    );
    camera.position.x = 0;
    camera.position.z = CAMERA_Z_COORDINATE;
    camera.position.y = -1;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, window.innerHeight);
    container.appendChild(renderer.domElement);

    let geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: "black" })
    );
    scene.add(line);

    addLight();

    generateHorses(200);
    generateSnakes(20);
    generateElephants(15);

    window.addEventListener("resize", onWindowResize, false);
  }

  const addLight = () => {
    let light = new THREE.DirectionalLight(0xefefff, 1.5);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    let secondLight = new THREE.DirectionalLight(0xffefef, 1.5);
    light.position.set(-1, -1, -1).normalize();
    scene.add(secondLight);
  };

  function setDirectionOnEventKeyPress(event) {
    setStartScore(true);
    direction = event.code;
    camera.updateProjectionMatrix();
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  const randomNumberGenerator = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const loadAnimalWithAnimation = (path, scalar, coordinates, duration = 1) => {
    let { x, y, z } = coordinates;
    loader.load(path, function (gltf) {
      mesh = gltf.scene.children[0];
      mesh.scale.setScalar(scalar);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(duration).play();
      mixerGroup.push(mixer);
    });
  };

  const generateHorses = (numberOfHorses) => {
    for (const item of [...Array(numberOfHorses).keys()]) {
      let coordinates = generateRandomXZPositionsWithYCoordinate(-2);
      loadAnimalWithAnimation(horsePath, 0.0152, coordinates);
    }
  };

  const generateSnakes = (number) => {
    for (const item of [...Array(number).keys()]) {
      let coordinates = generateRandomXZPositionsWithYCoordinate(-4);
      loadAnimalWithAnimation(snakePath, 1, coordinates, 10);
    }
  };

  const generateElephants = (number) => {
    for (const item of [...Array(number).keys()]) {
      let coordinates = generateRandomXZPositionsWithYCoordinate(-2);
      loadAnimalWithAnimation(elephantPath, 1.5, coordinates);
    }
  };

  const generateRandomXZPositionsWithYCoordinate = (y) => {
    let x = randomNumberGenerator(lowerXRange, higherXRange);
    let z = randomNumberGenerator(lowerZRange, higherZRange);
    return { x, y, z };
  };

  function onWindowResize() {
    camera.aspect = width / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, window.innerHeight);
  }

  const addFogToScene = () => {
    const near = 1;
    const far = 1200;
    scene.fog = new THREE.Fog(pastelCream, near, far);
  };

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    handleMovementAnimation();
    updateMixers();
  }

  const updateMixers = () => {
    let dt = clock.getDelta();
    mixerGroup.forEach((mixer) => {
      if (mixer) mixer.update(dt);
    });
  };

  const [startScore, setStartScore] = useState(false);

  const handleMovementAnimation = () => {
    let forwardSpeed = 20;
    let noSpeedChange = 0;
    let sideSpeed = 0.1;
    let longPressAddedSpeed = 7;

    switch (direction) {
      case undefined:
        camera.position.z -= noSpeedChange;
        break;
      case ARROW_UP:
        forwardSpeed += longPressAddedSpeed;
        camera.position.z -= forwardSpeed;
        break;
      case ARROW_LEFT:
        camera.position.x -= sideSpeed;
        camera.position.z -= forwardSpeed;
        break;
      case ARROW_RIGHT:
        camera.position.x += sideSpeed;
        camera.position.z -= forwardSpeed;
        break;
      default:
        camera.position.z -= forwardSpeed;
    }
  };

  const showStopWatch = () => {
    return startScore ? (
      <Stopwatch />
    ) : (
      <div>
        <br />0
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className={"score-counter"}> Score: {showStopWatch()}</div>
      <div className="App" id="container" />
    </div>
  );
}

export default App;
