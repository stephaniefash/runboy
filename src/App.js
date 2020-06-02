import React, { useEffect } from "react";
import "./App.css";
import * as THREE from "three";

function App() {
  const pastelCream = "#f1e6c4";
  let scene, camera, renderer;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(pastelCream);
    let container = document.getElementById("container");

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.z = 60;
    camera.position.y = 0;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    let geometry = new THREE.BoxGeometry(3, 1, 1, 3, 3);
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: "black" })
    );
    scene.add(line);

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
