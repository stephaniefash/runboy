import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as THREE from "three";

function App() {
  let scene, camera, renderer;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("");
    let container = document.getElementById("container");

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.x = -4;
    camera.position.z = 4;
    camera.position.y = 2;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize, false);
  }

  useEffect(() => {
    init();
    animate();
  }, []);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  return <div className="App" id="container" />;
}

export default App;
