### Civilization 2 - Web Engine Prototype

This is a demo of a Civilization 2 CSS/HTML5 based engine, that will hopefully lay foundations for the full-scale game in the future, playable both on the desktop as well as mobile devices.
It features:
* 3D view (CSS 3D transformations) of the terrain and the units. 
* Optional 2D only rendering for mobile devices 
* Animated water
* Map editor
 
 
This project tests the capabilities of DOM only rendering techniques in terms of performance and responsiveness on mobile devices. It runs notably faster than pure Canvas implementation and allows any viewport size without significant performance hit.
The 3D feature, that adds perspective to the ground and makes units and cities as well as terrain features (forests, mountains) to stand out, is optional, and also configurable for various viewing angles.

*NOTE: for best performance, test on Chrome/Safari browsers*


**DEMO:** https://dl.dropboxusercontent.com/u/11531325/civ2/index.html

Right Click + Drag  - pan map around
Left Click          - edit terrain
