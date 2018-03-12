# Battleship
React/Javascript based implementation of the game of battleship

### Notes
* As a scope constraint, this implementation has been built using standards for modern browsers, like CSS Grid and ES6. It will have major issues in older browsers like IE < 11.
These issues could easily be remedied with fallback code for CSS and polyfills for JS.
* Built using Create-React-App

### Components
1. App
  * Contains boards for 2 players and manages data transfer between each player.
2. Board
  * The top and bottom board for each player.
  * The top board records shots taken against opponent.
  * The bottom board holds players ships and records opponents shots against them.
3. Grid
  * A grid layout on which to place ships and take shots.
  * Each cell in the grid is a possible location for a ship or a shot.
4. Ship Drawer
  * Contains all ships that need to be placed on a board
