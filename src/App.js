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
  const width = 800;
  const path = "http://192.168.1.222:8000/src/models/Horse.glb";

  let scene, camera, renderer, direction, mixer, mesh;
  let mixerGroup = [];
  let loader = new GLTFLoader();
  let clock = new THREE.Clock();

  function init() {
    scene = new THREE.Scene();
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
    camera.position.y = 0;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    let geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: "black" })
    );
    scene.add(line);

    generateMultipleCubes();

    // horses

    let light = new THREE.DirectionalLight(0xefefff, 1.5);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    let secondLight = new THREE.DirectionalLight(0xffefef, 1.5);
    light.position.set(-1, -1, -1).normalize();
    scene.add(secondLight);

    window.addEventListener("resize", onWindowResize, false);
  }

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

  const generateMultipleCubes = () => {
    const lowerXRange = -3;
    const higherXRange = 3;
    const lowerZRange = -200000;
    const higherZRange = 1000;

    const NUMBER_OF_CUBES = 500;

    for (const item of [...Array(NUMBER_OF_CUBES).keys()]) {
      let xCoordinate = randomNumberGenerator(lowerXRange, higherXRange);
      let zCoordinate = randomNumberGenerator(lowerZRange, higherZRange);
      loadSingleHorse({ xCoordinate, zCoordinate });
    }
  };

  const loadSingleHorse = ({ xCoordinate, zCoordinate }) => {
    loader.load(path, function (gltf) {
      mesh = gltf.scene.children[0];
      mesh.scale.setScalar(0.0152);
      mesh.position.set(xCoordinate, -2, zCoordinate);
      scene.add(mesh);
      mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1).play();
      mixerGroup.push(mixer);
    });
  };

  function onWindowResize() {
    camera.aspect = width / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, window.innerHeight);
  }

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
    let forwardSpeed = 10;
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
        <br /> 0
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
