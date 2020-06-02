import React, { useEffect } from "react";
import "./App.css";
import * as THREE from "three";

function App() {
  const pastelCream = "#f1e6c4";
  const ARROW_UP = "ArrowUp";
  const ARROW_LEFT = "ArrowLeft";
  const ARROW_RIGHT = "ArrowRight";
  const STARTING_SPEED = "startingSpeed";
  const CAMERA_Z_COORDINATE = 900;
  let scene, camera, renderer, direction;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(pastelCream);
    let container = document.getElementById("container");
    document.onkeydown = setDirectionOnEventKeyPress;

    camera = new THREE.PerspectiveCamera(
      1,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.x = 0;
    camera.position.z = CAMERA_Z_COORDINATE;
    camera.position.y = 0;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    window.addEventListener("resize", onWindowResize, false);
  }

  useEffect(() => {
    init();
    animate();
  });

  const randomNumberGenerator = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateMultipleCubes = () => {
    const lowerXRange = -2;
    const higherXRange = 2;
    const lowerZRange = -20000;
    const higherZRange = 1000;

    const NUMBER_OF_CUBES = 50;

    [...Array(NUMBER_OF_CUBES).keys()].forEach((item) => {
      let xCoordinate = randomNumberGenerator(lowerXRange, higherXRange);
      let zCoordinate = randomNumberGenerator(lowerZRange, higherZRange);

      let geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3);
      let edges = new THREE.EdgesGeometry(geometry);
      let line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: "black" })
      );
      line.position.set(xCoordinate, 0, zCoordinate);
      scene.add(line);
    });
  };

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    handleMovementAnimation();
  }

  const handleMovementAnimation = () => {
    let forwardSpeed = 10;
    let noSpeedChange = 0;
    let sideSpeed = 0.05;

    switch (direction) {
      case undefined:
        camera.position.z -= noSpeedChange;
        break;
      case ARROW_UP:
        forwardSpeed += 4;
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

    getScore();

  };

  const getScore = () => {
    const score = Math.abs(camera.position.z - CAMERA_Z_COORDINATE);
  }

  function setDirectionOnEventKeyPress(event) {
    direction = event.code;
  }

  return <div className="App" id="container" />;
}

export default App;
