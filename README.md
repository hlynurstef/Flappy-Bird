# Flappy Bird

This is a clone of the famous Flappy Bird game written in HTML5, CSS3 and JavaScript.

## About

* 480x320 pixel game canvas that resizes with the browser window.
* All positions and sizes defined using a 10px em. This means that the game could be scaled up and down by changing the base font-size.

## Controls

* Jump: Space/Mouseclick/Tap
* Mute: M
* Collision Visualization: C

## How to play

* Make the bird jump.
* Don't hit the pipes or the ground.
* Remain calm and have fun!

## Music

* Nightmare Mode song: http://freesound.org/people/frankum/sounds/346193/

## Setup

```
npm install
bower install
grunt serve
```

### Extra points ###
* Random background  (night / day)
* Random bird color
* Bird bounces if he hits an obstacle
* Circle-Rectangle collision calculations by calculating the distance to the closest points on the pipes and checking if they intersect with the circle area of the bird (function checkPipeCollision() in player.js)
* Press C on your keyboard to see the collision detection in action!
* Press M on your keyboard to mute audio!
* Nightmare mode!