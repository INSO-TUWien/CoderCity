import * as THREE from 'three';
import { Entity } from './entity';
import { EarthControls } from './controls/EarthControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { City } from './entities/City';
import { MousePicker } from './controls/MousePicker';
import { Directory } from '../model/directory.model';
import { BuildingColorMapper } from './util/color/building-color-mapper';
import { BuildingRandomColorMapper } from './util/color/building-random-color-mapper';
import { Preferences, BuildingColorMapperPreference } from '../components/settings-panel/state/preferences.model';

export class Engine {
    private canvasElement: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private light: THREE.AmbientLight;
    private axesHelper: THREE.AxesHelper;
    private gridHelper: THREE.GridHelper;
    private controls: any;
    private city: City;
    private buildingColorMapper: BuildingColorMapper = new BuildingRandomColorMapper();

    private entities: Entity[] = [];

    private stats = new Stats();

    constructor() {
        this.canvasElement = document.querySelector('#canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasElement,
            logarithmicDepthBuffer: true
        });

        // Set canvas size to whole viewport
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.setCanvasSize(width, height);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set( 0, 50, 60);

        this.light = new THREE.HemisphereLight( 0xffffff, 0x8f8f8f, 1);
        this.light.position.set( 0, 50, 10);

        this.scene.add(this.light);
        this.scene.background = new THREE.Color('#EEEEEE');

        this.controls = new EarthControls(this.camera, this.renderer.domElement);

        window.addEventListener('resize', () => this.handleWindowResize(), false);

        this.render();
        this.init();
    }

    private init() {
        //document.body.appendChild(this.stats.dom);
        this.setupScene();
    }

    private initHelpers() {
        /**
         * An axis object to visualize the 3 axes in a simple way.
         * The X axis is red. The Y axis is green. The Z axis is blue.
         */
        this.axesHelper = new THREE.AxesHelper(30);
        this.gridHelper = new THREE.GridHelper(100, 100);
        this.scene.add(this.gridHelper);
        this.scene.add(this.axesHelper);
    }

    private handleWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    private setupScene() {
        // Init raycaster
        const mousePicker = new MousePicker(
            this.camera,
            this.scene,
            this.canvasElement
        );
        this.addEntity(mousePicker);
    }

    /**
     * Generates a city based on git snapshot
     */
    generateCity(directory: Directory): void {
        if (this.city != null) {
            console.log(`generateCity: Deleting city`);
            this.deleteEntity(this.city);
        }

        this.city = new City({buildingColorMapper: this.buildingColorMapper});
        //this.city.generateExampleCity();
        this.city.generateCity(
            directory
        );
        this.city.centerCityPosition();
        this.addEntity(this.city);
    }

    setBuildingColorMapper(buildingColorMapper: BuildingColorMapper) {
        if (buildingColorMapper != null) {
            this.buildingColorMapper = buildingColorMapper;
        }
    }

    addEntity(entity: Entity): void {
        entity.init();
        this.scene.add(entity.object);
        this.entities.push(entity);
    }

    deleteEntity(entity: Entity): void {
        entity.destroy();
        this.scene.remove(entity.object);
        this.entities.splice(this.entities.indexOf(entity), 1);
    }

    private render(): void {
        requestAnimationFrame( () => this.render());

        this.stats.begin();
        this.controls.update();
        this.entities.forEach(entity => {
            entity.update();
        });

        this.stats.end();
        this.renderer.render(this.scene, this.camera);
    }

    setCanvasSize(width: number, height: number) {
        this.renderer.setSize(width, height);
    }

    start(): void {
    }

    stop(): void {
    }
}
