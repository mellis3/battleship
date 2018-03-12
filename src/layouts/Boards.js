import React from 'react';
import { Grid } from '../elements/Grid';
import { ShipDrawer, SunkShip } from '../elements/Ship';
import { createArrayOfNumbers } from '../functions/array';

//typography
import { CardTitle, ElementTitle } from '../typography/typography';

//data
import { data } from '../data/staticData';

/*
    Board, both top and bottom
    Each player has their own board
    Top board is for recording shots/placement of opponents ships
    Bottom board is for placing their own ships and recording opponents shots against them
*/
export class Board extends React.Component{
    constructor( props ){
        super( props );

        this.state = {
            //starting state for ships - using unique data for each so ships could be different for each player ( different names/sizes etc )
            ships: data[ `player${ this.props.player }Ships` ],
            //which ship user is current placing, when they are placing ships
            activeShip: null,
            //array of ships that are on the bottom board
            placedShips: [],
            //array of opponents ships that have been sunk - used to show progress
            sunkShips: [],
            //array of opponents shots - used to show if players ships have been hit
            opponentShots: null
        };

        this.placeShip = this.placeShip.bind( this );
        this.shipPlacementComplete = this.shipPlacementComplete.bind( this );
        this.shotHandler = this.shotHandler.bind( this );
    }

    /*
        Set active ship, while placing ships
        Passes data down to bottom board
    */
    placeShip( ship ){
        this.setState( {
            activeShip: ship
        } );
    }

    /*
        Individual Ship placement complete
        Remove ship from the ones that need to be placed
        When all ships have been placed then move to next step
    */
    shipPlacementComplete(){
        let placedShips = this.state.placedShips;
        placedShips.push( this.state.activeShip );
        this.setState( {
            activeShip: null,
            placedShips: placedShips
        } );


        //once all ships are placed go to next step
        //pass placed ships up to parent to store
        if( placedShips.length === this.state.ships.length ){
            console.log( "all ships placed" );
            this.props.stepCompleteHandler( placedShips );
        }
    }

    /*
        Shot handler
        Top board requests if cell selected contains opponents ship
        Pass cell number up to App to check against opponents ship locations
        Pass result back down to top board to display the result of the shot
    */
    shotHandler( cellNum ){
        console.log( "check status of cell:", cellNum );

        //result of shot
        const result = this.props.shotHandler( cellNum );

        //if shot is a hit, result will contain which ship was hit
        //if ships status is sunk then show that ship as sunk
        if( result.ship !== null ){
            if( result.ship.status === "sunk" ){
                let sunkShips = this.state.sunkShips;
                sunkShips.push( result.ship );
                this.setState( {
                    sunkShips: sunkShips
                } );
            }
        }
        return result.status;
    }

    /*
        Go to the next player
    */
    turnComplete(){
        this.props.turnComplete();
    }

    //update opponent shots when parent pushes new data
    componentWillReceiveProps(){
        this.setState( {
            opponentShots: this.props.opponentShots
        } );
    }

    render() {
        console.log( `board for player ${ this.props.player } state:`, this.state );

        //array of sunk ships to display in the instructions panel
        let sunkShips = null;
        if( this.state.sunkShips.length > 0 ){
            sunkShips = this.state.sunkShips.map( ( s ) => {
                return(
                    <SunkShip key={ s.name } ship={ s } />
                );
            } );
        }

        return (
            <div className="board-item flex justify-center vertical-center padding-y-xlarge padding-x-xxlarge" data-player={ this.props.player }>

                <CardTitle classes="player-label padding-x-medium padding-y-small">Player { this.props.player }</CardTitle>

                <div className="board-item-inner">
                    <BoardTop
                        placedShips={ this.state.placedShips }
                        shotHandler={ this.shotHandler }
                        turnComplete={ this.turnComplete }
                    />
                    <BoardBottom
                        activeShip={ this.state.activeShip }
                        shipPlacedHandler={ this.shipPlacementComplete }
                        opponentShots={ this.state.opponentShots }
                    />
                </div>

                { /* slide in drawer element used to show which ships need to be placed on the board */ }
                <ShipDrawer ships={ this.state.ships } placedShips={ this.state.placedShips } activeShip={ this.state.activeShip } activeShipHandler={ this.placeShip } />

                { /*
                    instructions for firing shots when in fire-state
                    show opponent ships that have been sunk
                */ }
                <div className="instructions padding-large">
                    <ElementTitle classes="dash-below margin-bottom-large">Destroy Your Enemy</ElementTitle>
                    <p>Choose a square on the top panel to fire at your enemy.</p>
                    <p>When your enemy fires back, shots will appear in the bottom panel to show the status of your ships.</p>
                    { sunkShips !== null &&
                        <div className="sunkShips margin-top-xlarge">
                            <CardTitle classes="margin-bottom-medium">
                                Sunken Ships
                                <span className="count margin-left-medium">
                                    { this.state.sunkShips.length }/ 3
                                </span>
                            </CardTitle>
                            { sunkShips }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

/*
    Top Board
    Used for recording shots taken against opponent
*/
class BoardTop extends React.Component{
    constructor( props ){
        super( props );

        this.cellSelect = this.cellSelect.bind( this );

        this.state = {
            shots: [],
            disable: false //after shot has been made disable until next turn
        };
    }

    /*
        Select cell
        Used to fire a shot
        Push the cell number up to the parent to see if the shot was a hit or miss
    */
    cellSelect( cell ){
        const cellNumber = parseInt( cell.getAttribute( "data-cell" ), 10 );

        //set state
        let shots = this.state.shots;
        shots.push( {
            cell: cellNumber,
            status: this.props.shotHandler( cellNumber ) //see if shot is a hit or miss
        } );
        this.setState( {
            shots: shots,
            disable: true
        } );
    }

    /*
        When it is players turn again remove the disable flag
    */
    componentWillReceiveProps(){
        this.setState( {
            disable: false
        } );
    }


    render(){
        return (
            <div className="board-top" data-disable={ this.state.disable }>
                <Grid
                    type="opponentsShips"
                    numRows={ data.boards.rows }
                    numColumns={ data.boards.columns }
                    cellClickHandler={ this.cellSelect }
                    cellStatus={ this.state.shots }
                />
            </div>
        );
    }
}


/*
    Bottom Board
    Used for placement of players ships
*/
class BoardBottom extends React.Component{
    constructor( props ){
        super( props );

        this.state = {
            activeShip: null,
            boardState: "waiting",
            opponentShots: null
        };

        this.placeShip = this.placeShip.bind( this );
        this.shipPlacedComplete = this.shipPlacedComplete.bind( this );
        this.cellSelect = this.cellSelect.bind( this );
    }

    /*
        Place the currently selected ship
        Set that it's the active ship and which state the board is in.
        Placing a ship requires 2 steps.
            1. select start squares
            2. select square in the direction the ship should be placed
    */
    placeShip( ship ){
        if( ship === null ){
            return false;
        }

        Object.assign( ship, {
            start: null,
            end: null,
            set: false,
            status: "active"
        } );

        this.setState( {
            activeShip: ship,
            boardState: "selectStartSquare"
        } );
    }

    /*
        Callback for when a ship is done being placed
        Set active ship back to null and wait for the next ship to be placed
        Call function in parent to move on when to next step when all ships are sunk
    */
    shipPlacedComplete(){
        if( typeof this.props.shipPlacedHandler === "function" ){
            this.props.shipPlacedHandler();
        }

        this.setState( {
            activeShip: null,
            boardState: "waiting"
        } );
    }

    /*
        Select select
        Used to place a ship
        If start is start square then determine possible options for direction of ship
    */
    cellSelect( cell ){
        if( this.state.boardState === "waiting" ){
            alert( "Please select which ship you would like to place" );
            return false;
        }

        const cellNumber = parseInt( cell.getAttribute( "data-cell" ), 10 );
        const shipData = this.state.activeShip;

        //set starting cell
        //determine options for remainder of ship
        if( this.state.boardState === "selectStartSquare" ){
            shipData.start = cellNumber;
            shipData.cellOptions = this.findCellOptions( shipData.start, shipData.length );
            this.setState( {
                activeShip: shipData,
                boardState: "selectEndSquare"
            } );
        }

        //set ending cell / direction for ship
        //user can select anywhere along the direction, so figure out what the end square would be
        if( this.state.boardState === "selectEndSquare" ){

            //if selecting a random cell that's not in the options, return false as ship location would be invalid
            if( shipData.cellOptions.indexOf( cellNumber ) === -1 ){
                alert( "Please choose one of the highlighted cells in the direction you would like to place the ship" );
                return false;
            }

            //determine direction, end of ship and cells in between
            const location = this.determineDirection( shipData, cellNumber );
            shipData.end = location.end;
            shipData.cells = location.cells;
            shipData.hitCells = [];
            shipData.set = true;

            this.setState( {
                activeShip: shipData,
                boardState: "placeShip"
            } );
        }
    }

    /*
        Find possible locations for ship, once first cell is selected
        TO DO - find if cell is occupied by a ship already
    */
    findCellOptions( startCell, length ){

        length = length - 1; //need to subtract 1 since start cell is part of the length of the ship

        //build array of arrays to show cells by rows
        let allCells = [];
        for( let i = 0; i < data.boards.rows; i++ ){
            const startNum = ( i * data.boards.columns );
            allCells.push(
                createArrayOfNumbers(
                    ( startNum + 1 ),
                    data.boards.columns
                )
            );
        }

        //possible cell that could contain the current ship
        let possibleCells = [];

        //find which row the cell is in
        const row = allCells.filter( ( row ) => {
            return row.indexOf( startCell ) > -1 ? row : false;
        } )[0];
        const indexInRow = row.indexOf( startCell );

        //find which column the cell is in
        const column = allCells.map( ( row ) => {
            return row[ indexInRow ];
        } );
        const indexInColumn = column.indexOf( startCell );

        //left of start
        //if ship will fit in the current row to the left of start cell
        if( row.indexOf( startCell - length ) > -1 ){
            console.log( 'ship will fit to left' );
            possibleCells.push(
                createArrayOfNumbers(
                    ( startCell - length ),
                    ( startCell - ( startCell - length ) )
                )
            );
        }

        //right of start
        //if ship will fit in the current row to the right of start cell
        if( row.indexOf( startCell + length ) > -1 ){
            console.log( 'ship will fit to right' );
            possibleCells.push(
                createArrayOfNumbers(
                    ( startCell + 1 ),
                    ( ( startCell + length ) - startCell )
                )
            );
        }

        //down from start
        //if ship will fit in the current column down from the start
        if( indexInColumn + length < column.length ){
            console.log( 'ship will fit below' );
            possibleCells.push(
                column.slice(
                    ( indexInColumn + 1 ),
                    ( indexInColumn + 1 + length )
                )
            );
        }

        //up from start
        //if ship will fit in the current column up from the start
        if( indexInColumn - length >= 0 ){
            console.log( 'ship will fit above' );
            possibleCells.push(
                column.slice(
                    ( indexInColumn - length ),
                    ( indexInColumn )
                )
            );
        }

        //merge the arrays of cells for each direction into one array and sort
        return [].concat.apply( [], possibleCells )
                .sort( function( a, b ){
                    return a - b;
                } );
    }


    /*
        Determine which direction users is trying to place the ship
        Return end cell and all the ones in between
    */
    determineDirection( shipData, selectedCell ){

        const length = shipData.length - 1;
        let end = null;
        let allCells = [ shipData.start ];

        //going left
        if( selectedCell >= shipData.start - length && selectedCell < shipData.start ){
            console.log( "place ship to left of start cell" );
            end = shipData.start - length;
            allCells.push(
                createArrayOfNumbers(
                    ( shipData.start - length ),
                    ( length + 1 )
                )
            );
        }

        //going right
        else if( selectedCell > shipData.start && selectedCell <= shipData.start + length ){
            console.log( "place ship to right of start cell" );
            end = shipData.start + length;
            allCells.push(
                createArrayOfNumbers(
                    ( shipData.start ),
                    ( length + 1 )
                )
            );
        }

        //going up
        else if( selectedCell < shipData.start ){
            console.log( "place ship up from start cell" );
            end = shipData.cellOptions[0]; //end would be the first cell in the options array
            allCells.push(
                shipData.cellOptions.slice( 0, length )
            );
        }

        //going down
        else{
            console.log( "place ship down from start cell" );
            end = shipData.cellOptions[ shipData.cellOptions.length - 1 ]; //end would be the last cell in the options array
            allCells.push(
                shipData.cellOptions.slice( shipData.cellOptions.length - length, shipData.cellOptions.length )
            );
        }

        //sort and merge
        allCells = [].concat.apply( [], allCells )
                    .sort( function( a, b ){
                        return a - b;
                    } );
        allCells = allCells.filter( ( item, index, self ) => self.indexOf( item ) === index );

        return {
            end: end,
            cells: allCells
        };
    }


    /*
        Updates passed down to bottom board
    */
    componentWillReceiveProps( nextProps ){
        //Update which ship is active when placing a ship onto the board
        if( this.state.activeShip !== nextProps.activeShip ){
            this.placeShip( nextProps.activeShip );
        }
        //Update opponent shots when one occurs
        if( this.state.opponentShots !== nextProps.opponentShots ){
            this.setState( {
                opponentShots: nextProps.opponentShots
            } );
        }
    }

    render(){
        return (
            <div className="board-bottom" data-state={ this.state.boardState } ref={ ( el ) => { this.board = el; } }>
                <Grid
                    type="yourShips"
                    numRows={ data.boards.rows }
                    numColumns={ data.boards.columns }
                    cellClickHandler={ this.cellSelect }
                    boardState={ this.state.boardState }
                    shipData={
                        this.state.activeShip !== null ? this.state.activeShip : null
                    }
                    shipPlaced={ this.shipPlacedComplete }
                    opponentShots={ this.state.opponentShots }
                />
            </div>
        );
    }
}
