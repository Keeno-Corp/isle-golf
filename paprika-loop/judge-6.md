The `ballShadow1` / `ballShadow2` z-fight is already in my verdict, under Faults and Next item 3. The two shadows share the plane y = 4.49. Because `ball2` is the waiting player's ball, the clash only shows with 2 players. The fix is to offset one shadow by 0.001 in y or give it `polygonOffset`. The scores are unchanged.

SCORE: 7.1
