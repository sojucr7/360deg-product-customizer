const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 5;
camera.position.x = 0;

const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Set background
scene.background = new THREE.Color(0xf1f1f1);

scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);


var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );

hemiLight.position.set( 0, 50, 0 );  

scene.add( hemiLight );



var dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );

dirLight.position.set( -8, 12, 8 );

dirLight.castShadow = true;

dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

scene.add( dirLight );

const groundGeometry = new THREE.BoxGeometry( 30, 0.01, 40 );

const groundMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );

groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );

groundMesh.position.set(0, -1, 0)

groundMesh.receiveShadow = true;

scene.add(groundMesh)

const controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.target.set( 0, 0.5, 0 );

controls.enablePan = false;

controls.enableDamping = true;

controls.maxPolarAngle = Math.PI/2;



function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
animate();


window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth/ window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);
});

const loader = new THREE.GLTFLoader();
// Load a glTF resource
loader.load(
    // resource URL
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb",
    // called when the resource is loaded
    function (gltf) {
        const model = gltf.scene;
        model.rotation.y = Math.PI;
        model.scale.set(2,2,2);
        model.position.y = -1;
        scene.add(model);
        model.traverse( function ( object ) {

            if ( object.isMesh ){
                object.castShadow = true;
              }

        } );
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
        console.log("An error happened");
    }
);