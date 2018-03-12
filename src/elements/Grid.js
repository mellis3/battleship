import React from 'react';

export class Grid extends React.Component{
    constructor( props ){
        super( props );

        this.cellClickHandler = this.cellClickHandler.bind( this );
        this.isOption = this.isOption.bind( this );

        this.state = {
            cellOptions: null, //when placing ships, possible locations to place it
            ships: [], //placed ships
            shots: [], //player shots
            opponentShots: [] //opponent shots
        };
    }

    /*
        Cell Select Handler
        When a cell is clicked pass that data up to the parent to handle it
    */
    cellClickHandler( cell ){
        if( typeof this.props.cellClickHandler === "function" ){
            this.props.cellClickHandler( cell.target );
        }
    }

    /*
        Updates passed down to grid
    */
    componentWillReceiveProps(){

        //if board type is your-ships/bottom board
        //when placing ships
        if( this.props.type === "yourShips" && this.props.shipData !== null ){

            //if selecting start square
            if( this.props.boardState === "selectStartSquare" ){
                this.setState( {
                    activeCell: this.props.shipData.start,
                    cellOptions: this.props.shipData.cellOptions
                } );
            }

            //if ready to place the ship
            if( this.props.boardState === "selectEndSquare" ){

                //tell parent board that ship has been placed
                if( typeof this.props.shipPlaced === "function" ){
                    this.props.shipPlaced();
                }

                //update state for newly placed ship and reset to be ready for new ship placement
                let placedShips = this.state.ships;
                placedShips.push( this.props.shipData );
                this.setState( {
                    activeCell: null,
                    cellOptions: null,
                    ships: placedShips
                } );
            }
        }

        //if logging shots fired by opponent
        if( this.props.type === "yourShips" && this.props.opponentShots !== null ){
            this.setState( {
                opponentShots: this.props.opponentShots
            } );
        }

        //if board to is opponentsShips/top board
        if( this.props.type === "opponentsShips" ){
            this.setState( {
                shots: this.props.cellStatus
            } );
        }
    }


    /*******  for bottom boards  *******/
    /*
        check if cell is an option for the ship reside
    */
    isOption( num ){
        return this.state.cellOptions.indexOf( num ) > -1 ? true : false;
    }

    /*
        check if cell is active when selecting a location for a ship
    */
    isActive( num ){
        return this.state.activeCell === num ? true : false;
    }

    /*
        check if cell is part of a ship
    */
    partOfShip( num ){
        let state = false;
        for( let s of this.state.ships ){
            if( s.cells.indexOf( num ) > -1 ){
                state = true;
            }
        }
        return state;
    }

    /*
        Check if cell is hit or miss when opponent fires shot
    */
    isHit( num ){
        let result = false;
        if( this.state.opponentShots.length > 0 ){
            let cellStatus = this.state.opponentShots.filter( ( s ) => {
                return s.cell === num;
            } );
            if( cellStatus.length > 0 ){
                result = cellStatus[0].status;
            }
        }
        return result;
    }


    /*******  for top boards  *******/
    /*
        Check is status is hit/miss or empty if not been selected
    */
    hitStatus( num ){
        let status = this.state.shots.filter( ( s ) => {
            return s.cell === num;
        } );
        return status.length > 0 ? status[0].status : "empty";
    }


    render() {

        //build grid cells
        const totalNumCells = this.props.numColumns * this.props.numRows;
        const cells = [];

        //create cells
        //when placing ships
        if( this.props.type === "yourShips" && this.state.cellOptions !== null ){
            for( let i = 0; i < totalNumCells; i++ ){
                let cellNum = i + 1;
                cells.push(
                    <GridCell
                        key={ `cell${ i }` }
                        number={ cellNum }
                        clickHandler={ this.cellClickHandler }
                        isCellOption={ this.isOption( cellNum ) }
                        isActiveCell={ this.isActive( cellNum ) }
                        isShip={ this.partOfShip( cellNum ) }
                    />
                );
            }
        }

        //when you fire a shot, record it on the top board
        else if( this.props.type === "opponentsShips" ){
            for( let i = 0; i < totalNumCells; i++ ){
                let cellNum = i + 1;
                cells.push(
                    <GridCell
                        key={ `cell${ i }` }
                        number={ cellNum }
                        clickHandler={ this.cellClickHandler }
                        status={ this.hitStatus( cellNum ) }
                    />
                );
            }
        }

        //else when jsut needing to show ships and their status
        else{
            for( let i = 0; i < totalNumCells; i++ ){
                let cellNum = i + 1;
                cells.push(
                    <GridCell
                        key={ `cell${ i }` }
                        number={ cellNum }
                        clickHandler={ this.cellClickHandler }
                        isShip={ this.partOfShip( cellNum ) }
                        isHit={ this.isHit( cellNum ) }
                    />
                );
            }
        }

        return (
            <div className="grid-wrap">
                <div className="grid grid-guidelines" data-columns={ this.props.numColumns } data-rows={ this.props.numRows }>
                    { cells }
                </div>
                <GridAxis numColumns={ this.props.numColumns } numRows={ this.props.numRows } />
            </div>
        );
    }
}



/*
    Generate Grid Cells
    Set classes to indicate state of cell
*/
class GridCell extends React.Component{
    render(){

        let classes = 'grid-cell';
        if( this.props.isActiveCell === true ){
            classes += " active";
        }
        if( this.props.isCellOption === true ){
            classes += " available";
        }
        if( this.props.isShip === true ){
            classes += " containsShip";
        }
        if( typeof this.props.status !== "undefined" && this.props.status !== "empty" ){
            classes += ` ${ this.props.status }`;
        }
        if( this.props.isHit === "hit" ){
            classes += " hit";
        }
        if( this.props.isHit === "miss" ){
            classes += " miss";
        }
        return(
            <div
                className={ classes }
                data-cell={ this.props.number }
                onClick={ this.props.clickHandler }
            ></div>
        );
    }
}



/*
    Generate grid axis
*/
class GridAxis extends React.Component{
    render(){

        //x axis
        const axisX = [];
        for( let j = 0; j < this.props.numColumns; j++ ){
            axisX.push(
                <div key={ `axis-x-${ j }` } className="axis-item flex-grow text-align-center">{ j + 1 }</div>
            );
        }

        //y axis
        const axisY = [];
        for( let k = 0; k < this.props.numRows; k++ ){
            axisY.push(
                <div key={ `axis-y-${ k }` } className="axis-item flex-grow">{ String.fromCharCode( 97 + k ) }</div>
            );
        }

        return(
            <div className="grid-axis">
                <div className="axis axis-x flex">
                    { axisX }
                </div>
                <div className="axis axis-y flex flex-column">
                    { axisY }
                </div>
            </div>
        );
    }
}
