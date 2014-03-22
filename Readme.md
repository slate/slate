# Slate

  Modern IRC client built with web technologies and node.js for OSX, Linux, and eventually Windows.

  ![slate irc client](https://dl.dropboxusercontent.com/u/6396913/slate/Screen%20Shot%202013-10-19%20at%2011.45.08%20AM.png)

  ![](https://dl.dropboxusercontent.com/u/6396913/slate/Screen%20Shot%202013-09-17%20at%207.47.36%20AM.png)

## Features

 - themable with CSS
 - scriptable with JavaScript
 - keyboard shortcuts and mapping
 - third-party plugin support
 - entirely built with web technologies for extensibility

## Installation

  TODO: when we have distribution set up

## About

 Slate is/was a single day hack project that was intended to be a kickstarter, however I ran out of time so now it's a partially-implemented IRC client! I had pretty lofty goals but unfortunately there's not enough time to go around, there are still many features missing, and it's not quite in a usable state, but with some community interest and love maybe it will get there some day! If not at least some useful/clean IRC libs are available at [https://github.com/slate](https://github.com/slate).

 Conceptually I really just wanted a clean, minimalistic IRC client, completely extensible through plugins. Ideally most of the core is written using such plugins. The entire thing should be themable, and the default theme should be programmer-friendly, aka get all the clutter out of my way, I just want to see chat logs.

## Usage

 - press `?` to display the shortcut dialog

## Building

 Install node, [node-webkit](https://github.com/rogerwang/node-webkit) and clone the repo.

 Build and run with:

```
$ make
```

  Build with:

```
$ make build
```

  Continuous build with:

```
$ watch make build
```

# License

  MIT

