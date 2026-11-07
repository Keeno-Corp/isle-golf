# look lane notes
Files: src/camera.js, src/stage.js, src/post.js.
Observe key `look`: camPitchDeg, flyoverT (0 outside intro), focusY, ball/pin/golfer {x,y,on} NDC through the live camera.
Actions: none. Events fired: none. Exports: `look` ({flyoverT}) from camera.js.
Done: sun at (-22,28,-16) (shadows fall lower right); aim cam lifts ball (look-ahead 2.2); C cam 55°; flyover diorama→overhead→low along tee→pin→behind ball; flight cam eases toward pin near the green; holed cam close on the cup.
Requests: course: other holes' flags still show in the aim/flyover view (hole 9 shows hole 8's pin).  hud-round: `SFX[k] is not a function` console error.
