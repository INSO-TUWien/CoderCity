import { KDTreeNode } from "./kd-treenode";
import * as THREE from 'three';
import { Bounds } from './bounds';
import { Element } from './element';

describe('Kd-treenode', () => {
    it('should insert elements correctly', () => {
        let position = new THREE.Vector2(0,0);
        let bounds = new Bounds(5,5);

        let element = new Element(new Bounds(3,3));
        let node = new KDTreeNode(position, bounds, 0, 2);
        let result = node.insertElement(element)
        expect(result).toBe(true);
    });

    it('should have two valid child nodes after split after inserting Element of size 3x3', () => {
        let position = new THREE.Vector2(0,0);
        let bounds = new Bounds(5,5);

        let element = new Element(new Bounds(3,3));

        let node = new KDTreeNode(position, bounds, 0, 2);
        let result = node.insertElement(element);
        expect(result).toBe(true);

        //Test position of left child node
    //    let positionLeftNode = new THREE.Vector2(0,3);
    //    expect(node.left.position).toEqual(positionLeftNode)
    })

    it('should have valid depth in splitted child nodes after inserting Element of size 3x3', () => {
        let position = new THREE.Vector2(0,0);
        let bounds = new Bounds(5,5);

        let element = new Element(new Bounds(3,3));

        let node = new KDTreeNode(position, bounds, 0, 2);
        let result = node.insertElement(element);
        expect(result).toBe(true);

        expect(node.left.depth).toBe(1);
        expect(node.right.depth).toBe(1);
    });

    it('should have valid position in splitted child nodes after inserting Element of size 3x3', () => {
        let position = new THREE.Vector2(0,0);
        let bounds = new Bounds(5,5);

        let element = new Element(new Bounds(3,3));

        let node = new KDTreeNode(position, bounds, 0, 2);
        let result = node.insertElement(element);
        expect(result).toBe(true);

        // Nodes of depth 1
        //Left node
        expect(node.left.position).toMatchObject(new THREE.Vector2(0,0));
        //Right node
        expect(node.right.position).toMatchObject(new THREE.Vector2(3,0));

        // Nodes of depth 2
        //Top left node
        expect(node.left.left.position).toMatchObject(new THREE.Vector2(0,0));
        //Bottom left node
        expect(node.left.right.position).toMatchObject(new THREE.Vector2(0,3));
    });

    it('should have valid bounds in splitted child nodes after inserting Element of size 3x3', () => {
        let position = new THREE.Vector2(0,0);
        let bounds = new Bounds(5,5);

        let element = new Element(new Bounds(3,3));

        let node = new KDTreeNode(position, bounds, 0, 2);
        let result = node.insertElement(element);
        expect(result).toBe(true);

        // Nodes of depth 1
        //Left node
        expect(node.left.position).toMatchObject(new THREE.Vector2(0,0));
        //Right node
        expect(node.right.position).toMatchObject(new THREE.Vector2(3,0));

        // Nodes of depth 2
        //Top left node
        expect(node.left.left.position).toMatchObject(new THREE.Vector2(0,0));
        //Bottom left node
        expect(node.left.right.position).toMatchObject(new THREE.Vector2(0,3));
    });

    it('should have valid position in splitted child nodes after inserting Element of size 3x3 and 1x1', () => {
        let position = new THREE.Vector2(0,0);
        let bounds = new Bounds(5,5);

        let element = new Element(new Bounds(3,3));
        let element2 = new Element(new Bounds(1,1));

        let node = new KDTreeNode(position, bounds, 0, 2);
        let result = node.insertElement(element);
        expect(result).toBe(true);

        let result2 = node.insertElement(element2);
        expect(result2).toBe(true);

        // Nodes of depth 1
        //Left node
        expect(node.left.position).toMatchObject(new THREE.Vector2(0,0));
        //Right node
        expect(node.right.position).toMatchObject(new THREE.Vector2(3,0));

        // Nodes of depth 2
        //Top left node
        expect(node.left.left.position).toMatchObject(new THREE.Vector2(0,0));
        //Bottom left node
        expect(node.left.right.position).toMatchObject(new THREE.Vector2(0,3));

        //Top right node
        //expect(node.right.left.position).toMatchObject(new THREE.Vector2(3,0));
        //Bottom right node
        //expect(node.right.right.position).toMatchObject(new THREE.Vector2(3,3));
    });
})