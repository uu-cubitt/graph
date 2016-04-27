# Cubitt Graph
Typescript Graph library for the Cubitt framework.

[![npm version](https://badge.fury.io/js/cubitt-graph.svg)](https://badge.fury.io/js/cubitt-graph)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/uu-cubitt/graph/master/LICENSE)
[![Build Status](https://travis-ci.org/uu-cubitt/graph.svg?branch=master)](https://travis-ci.org/uu-cubitt/graph)
[![Test Coverage](https://codeclimate.com/github/uu-cubitt/graph/badges/coverage.svg)](https://codeclimate.com/github/uu-cubitt/graph/coverage)

## About

This package contains an in-memory graph with connectors. All Elements have support for dynamic properties.
The graph has the following elements:

* ```Model```
A subgraph inside the graph. All Nodes and Edges have to be linked to a Model.
* ```Node```
A traditional Node.
* ```Connector```
A Connector is an element that is connected to a Node, to which edges can be connected. A Node can have many connectors. A Connector can have many edges.
* ```Edge```
An traditional directed edge that can be connected to connectors. It is not possible to connect an Edge directly to a Node.

It's main use case will be for the Cubitt framework, but the graph can be used standalone if it fits your datamodel.

## Installation

```bash
$ npm install cubitt-graph
```

## Features

* Intergraph links
* Hierarchical graphs
* Connector support
* Properties support on all Elements
* Typescript
* Unit tested 

## Usage

The ```Project``` class (implements ```GraphInterface```) is the main entrypoint for consumers of this package. It is as simple as:

```javascript
var graph = new Project();
```
All available methods on this class are described in the [Code documentation](https://uu-cubitt.github.io/graph/).


## Documentation

* [Code documentation](https://uu-cubitt.github.io/graph/)
* [Design documentation](https://uu-cubitt.github.io/graph/design/)

## For developers

To generate documentation run:
```bash
$ npm install --only=dev
$ node_modules/.bin/typedoc --out doc/ --module commonjs --exclude test --readme README.md --target ES5 --mode file src/
```

To run the tests:
```bash
$ npm install --only=dev
$ cd node_modules/cubitt-graph
$ mocha
```

To debug the tests (uses node-debug, uses Chrome debugging tools):
1. First set ```sourceMaps``` to ```true``` in ```src/tsdconfig.json``` (ensures that you can debug the Typescript code instead of the generated JavaScript)
```bash
$ npm install --only=dev
$ node-debug _mocha --no-timeouts
```

## People

The original authors of Cubitt are Sander Klock and Thomas Ipskamp. The project is coordinated by [Jan Martijn van der Werf](http://www.uu.nl/staff/JMEMvanderWerf).

## License

[MIT](LICENSE)
