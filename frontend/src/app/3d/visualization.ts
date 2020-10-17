import * as THREE from 'three';
import { Entity } from './entity';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { City } from './entities/City';
import { MousePicker } from './controls/MousePicker';
import { Directory } from '../model/directory.model';
import { BuildingColorMapper } from './util/color/building-color-mapper';
import { BuildingRandomColorMapper } from './util/color/building-random-color-mapper';
import { DistrictColorMapper } from './util/color/district-color-mapper';
import { DistrictRandomColorMapper } from './util/color/district-random-color-mapper';

export class Visualization {
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
    private districtColorMapper: DistrictColorMapper = new DistrictRandomColorMapper();

    private entities: Entity[] = [];

    private excludedFiles: string[] = [];
    private excludedAuthors: string[] = [];

    private stats = new Stats();

    constructor() {
        this.canvasElement = document.querySelector('#canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasElement,
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

        this.controls = new MapControls(this.camera, this.renderer.domElement);

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

    deleteCity(): void {
        console.log(`Deleting city`);
        if (this.city != null) {
            this.deleteEntity(this.city);
        }
    }

    /**
     * Generates a city based on git snapshot
     */
    generateCity(directory: Directory): void {
        this.deleteCity();

        this.city = new City(
            {
                buildingColorMapper: this.buildingColorMapper,
                districtColorMapper: this.districtColorMapper,
                excludedFiles: this.excludedFiles,
                excludedAuthors: this.excludedAuthors
            });
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

    setDistrictColorMapper(districtColorMapper: DistrictColorMapper) {
        if (districtColorMapper != null) {
            this.districtColorMapper = districtColorMapper;
        }
    }

    /**
     * Sets a list of excluded filenames which will be not rendered
     */
    setExcludedFiles(files: string[]) {
        this.excludedFiles = files;
    }

    setExcludedAuthors(authors: string[]) {
        this.excludedAuthors = authors;
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
        for (let entity of this.entities) {
            entity.update();
        }

        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    setCanvasSize(width: number, height: number) {
        this.renderer.setSize(width, height);
    }
}
