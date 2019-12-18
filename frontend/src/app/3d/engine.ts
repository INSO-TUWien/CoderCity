import * as THREE from 'three';
import { Entity } from './entity';
import { EarthControls } from './controls/EarthControls';
import { EventBus } from './eventbus';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Cube } from './entities/Cube';
import { District } from './entities/District';

export class Engine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private light: THREE.AmbientLight;
    private axesHelper: THREE.AxesHelper;
    private gridHelper: THREE.GridHelper;
    private controls: any;

    private entities: Entity[] = [];

    private eventBus: EventBus;

    private stats = new Stats();

    constructor() {
        this.eventBus = EventBus.getInstance();
        const canvasElement: HTMLCanvasElement = document.querySelector('#canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            logarithmicDepthBuffer: true
        });

        // Set canvas size to whole viewport
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.setCanvasSize(width, height);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set( 0, 50, 0);

        this.light = new THREE.HemisphereLight( 0x0000ff, 0x000000, 0.6 );
        this.light.position.set( 0, 50, 50);

        this.axesHelper = new THREE.AxesHelper(3);
        this.gridHelper = new THREE.GridHelper(100, 100);

        this.scene.add(this.gridHelper);
        this.scene.add(this.axesHelper);
        this.scene.add(this.light);
        this.scene.background = new THREE.Color('#EEEEEE');

        this.controls = new EarthControls(this.camera, this.renderer.domElement);
        this.render();
        this.init();
    }

    private init() {
        document.body.appendChild( this.stats.dom);
        this.setupScene();
    }

    private setupScene() {
        const district = new District();
        this.addEntity(district);
    }

    addEntity(entity: Entity): void {
        entity.init();
        this.scene.add(entity.object);
        this.entities.push(entity);
    }

    deleteEntity(entity: Entity): void {
        entity.destroy();
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

    /** Lat , Lon
         * Latitude (west <-> east)
         * Longitude (north <-> south)
         * NW https://www.google.at/maps/@48.1991423,16.3295664,14z
         * SE https://www.google.at/maps/@48.117447,16.5040823,14z
        **/
    setCanvasSize(width: number, height: number) {
        this.renderer.setSize(width, height);
    }

    start(): void {
    }

    stop(): void {
    }
}
