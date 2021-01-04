# CodeCity

This project is a three dimensional proof of concept visualization, which aims to visualize code ownership using the code city metapher, originally developed by Richard Wettel. https://wettel.github.io/codecity.html

Each building (block) represents a file in the visualization, while the height of the building corresponds to the line count of the file. Each building enclosed by it's contained folder, which is visually represented as a district (platform). Multiple districts can be stacked on top of each other if a folder contains another folder.

Information of the code ownership is derived using the metadata of each git hunk (See: git blame). Each hunk (visually represented as in the buildings) is then colored. 

## Configuration

TODO

## Implementation
This project was developed using Angular and NestJS (NodeJS).

*Used libraries:*
*Frontend:*
* Akita (State Management)
* SVG.js (SVG Library)

*Backend*
* Nodegit

## Installation
To build or run this project locally, install following dependencies:

## Downloads

### NodeJS
Please install the latest version of NodeJS
https://nodejs.org/en/download/

### Angular CLI
Install Angular CLI, please make sure you have NodeJS already installed prior.
> npm install -g @angular/cli
https://angular.io/guide/setup-local

### Docker
Please install docker for your operating system, if you wish to build or run the application using docker.