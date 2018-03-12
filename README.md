# Battleship
React/Javascript based implementation of the game of battleship

### Notes
* As a scope constraint, this implementation has been built using standards for modern browsers, like CSS Grid and ES6. It will have major issues in older browsers like IE < 11.
These issues could easily be remedied with fallback code for CSS and polyfills for JS.
* Built using Create-React-App 

### Components
1. App
  1. Contains boards for 2 players and manages data transfer between each player.
2. Board
  2. The top and bottom board for each player.
  2. The top board records shots taken against opponent.
  2. The bottom board holds players ships and records opponents shots against them.
3. Grid
  3. A grid layout on which to place ships and take shots.
  3. Each cell in the grid is a possible location for a ship or a shot.
4. Ship Drawer
  4. Contains all ships that need to be placed on a board
