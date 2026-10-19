import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF | null> => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      try {
        const gltf = await new Promise<GLTF>((resolve, reject) => {
          loader.load(blobUrl, resolve, undefined, reject);
        });

        const character: THREE.Object3D = gltf.scene;
        await renderer.compileAsync(character, camera, scene);
        character.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.frustumCulled = true;
            if (mesh.material && !Array.isArray(mesh.material)) {
              (mesh.material as THREE.ShaderMaterial).precision = "mediump";
            }
          }
        });

        setCharTimeline(character, camera);
        setAllTimeline();

        // Guard: a different model may not contain these bones.
        const footR = character.getObjectByName("footR");
        if (footR) footR.position.y = 3.36;
        const footL = character.getObjectByName("footL");
        if (footL) footL.position.y = 3.36;

        return gltf;
      } finally {
        // The GLB and its textures are fully parsed by now; the blob URL
        // is no longer needed either way (success or failure).
        URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      dracoLoader.dispose();
    }
  };

  return { loadCharacter };
};

export default setCharacter;
