import React from 'react';
import { ElementTitle, BodyCopy } from '../typography/typography';


/*
    SHIP DRAWER
    Slide out component where users select ships to place onto their board
*/
export class ShipDrawer extends React.Component{
    constructor( props ){
        super( props );

        this.state = {
            ships: this.props.ships,
            activeShip: null,
            placedShips: []
        };

        this.selectShip = this.selectShip.bind( this );
    }

    /*
        Toggle ship active state
        When in active state it is ready to be placed onto the board
    */
    selectShip( ship ){
        const shipNode = ship.target;
        const shipName = shipNode.getAttribute( "data-name" );

        //find data for ship
        const shipData = this.state.ships.filter( ( s ) => {
            return s.name === shipName;
        } )[0];

        //pass data up to parent to allow placement on the board
        this.props.activeShipHandler( shipData );
    }


    /*
        check if ship is active one
    */
    isShipActive( name ){
        if( this.state.activeShip === null ){
            return false;
        }
        return this.state.activeShip.name === name ? true : false;
    }

    /*
        check if ship has been placed already
    */
    isShipPlaced( name ){
        const matches = this.state.placedShips.filter( ( s ) => {
            return s.name === name;
        } );
        return matches.length > 0 ? true : false;
    }

    /*
        Receive new data from parent
    */
    componentWillReceiveProps( nextProps ){
        this.setState( {
            activeShip: nextProps.activeShip,
            placedShips: nextProps.placedShips
        } );
    }

    render(){

        let ships = this.state.ships.map( ( ship ) => {
            return(
                <ShipDrawerItem
                    key={ `ship-item-${ ship.name }` }
                    config={ ship }
                    clickHandler={ this.selectShip }
                    active={ this.isShipActive( ship.name ) }
                    isPlaced={ this.isShipPlaced( ship.name ) }
                />
            );
        } );

        return(
            <div className="ship-drawer padding-large">
                <ElementTitle classes="dash-below margin-bottom-large">Your Ships</ElementTitle>
                <BodyCopy classes="margin-bottom-small">Click to choose a ship, then select the squares on the board where you would like to place it.</BodyCopy>
                <BodyCopy classes="margin-bottom-large">You must place all your ships before the game can begin.</BodyCopy>
                <div className="ship-options">
                    { ships }
                </div>
            </div>
        );
    }
}

/*
    SHIP ITEM
    Specific ship item in the drawer
*/
class ShipDrawerItem extends React.Component{
    render(){
        const ship = this.props.config;

        let classes = "ship-item";
        if( this.props.active === true ){
            classes += " active";
        }
        if( this.props.isPlaced === true ){
            classes += " complete";
        }

        return(
            <div
                className={ classes }
                data-name={ ship.name }
                data-length={ ship.length }
                onClick={ this.props.clickHandler }
            >
                <div className="ship-item-inner padding-medium">
                    <p>{ ship.name }</p>
                </div>
            </div>
        );
    }
}


/*
    Sunk ship indicator, loaded into instructions when an enemy ship has been sunk
*/
export class SunkShip extends React.Component{
    render(){
        return (
            <div className="sunkShip ship-item" data-length={ this.props.ship.length }>
                <div className="ship-item-inner">
                    <p>{ this.props.ship.name }</p>
                </div>
            </div>
        );
    }
}
