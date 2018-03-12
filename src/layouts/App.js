import React, { Component } from 'react';
import { Board } from './Boards';
import { Button } from '../elements/Button';

//data
import { data } from '../data/staticData';


/*
    Top level component
    2 Players, manages data that needs to be accessed between each
    Steps are used for setup/placing ships, firing shots, win states
*/
class App extends Component {
    constructor( props ){
        super( props );

        this.state = {
            activePlayer: 1,
            showSwitch: false,
            step: data.steps[0],
            //ships store each players ship locations on the board
            ships: {
                player1: [],
                player2: []
            },
            //shots are used to pass shots from one player to the other to record hits/misses
            shots: {
                player1: [],
                player2: []
            }
        };
        this.stepComplete = this.stepComplete.bind( this );
        this.shotStatus = this.shotStatus.bind( this );
        this.playerSwitchComplete = this.playerSwitchComplete.bind( this );
    }

    /*
        When a step completes then switch to the next player
        Steps are "place ships" for setup, then "fire" for guessing, then finally "win"
        If setup is complete for a player then store their ships
    */
    stepComplete( playerShips = null ){
        const currentPlayer = this.state.activePlayer;
        const nextPlayer = this.state.activePlayer === 1 ? 2 : 1;
        let step = this.state.step;

        //if player is placing ships then store them
        let ships = this.state.ships;
        if( currentPlayer === 1 ){
            ships.player1 = playerShips;
        }else{
            ships.player2 = playerShips;
        }

        //if both players are done with placing ships, go into fire mode
        if( this.state.step === data.steps[0] && this.state.activePlayer === 2 ){
            step = data.steps[ 1 ];
        }

        this.setState( {
            activePlayer: nextPlayer,
            step: step,
            ships: ships
        } );
    }

    /*
        Switch Player
        Delay allows for current player to see events happen, like shots, before their turn expires.
    */
    switchPlayer( delay = 0, showSwitchMessage = false, shots = null ){
        setTimeout( () => {
            let updatedShots = this.state.shots;
            if( shots !== null ){
                updatedShots = shots;
            }

            //if show switch message is true - just show the message, don't actually switch
            if( showSwitchMessage === true ){
                this.setState( {
                    showSwitchMessage: true,
                    shots: updatedShots
                } );
            }

            //else complete the switch
            else{
                this.setState( {
                    activePlayer: this.state.activePlayer === 1 ? 2 : 1,
                    showSwitchMessage: false,
                    shots: updatedShots
                } );
            }
        }, delay );
    }

    /*
        Switch to opponent
        Occurs when players have switched and new player pushes button to begin their turn
    */
    playerSwitchComplete(){
        this.switchPlayer();
    }


    /*
        Shot Status
        Check if a shot hits opponents ship
        Return hit or miss
        If hit, update ship data to log each ships status
    */
    shotStatus( cellNum ){
        const currentPlayer = this.state.activePlayer;

        //opponents ships
        const ships = currentPlayer === 1 ? this.state.ships.player2 : this.state.ships.player1;

        //current players shots
        let shots = this.state.shots;

        //returnable data
        let result = {
            status: "miss",
            ship: null
        };

        //check if the shot hits a ship
        const hitShip = ships.filter( ( s ) => {
            return s.cells.indexOf( cellNum ) > -1;
        } );
        if( hitShip.length > 0 ){
            let ship = hitShip[0];

            //push the into the hitCells array
            ship.hitCells.push( cellNum );

            //if all cells are hit - ship is sunk
            if( ship.cells.length === ship.hitCells.length ){
                ship.status = "sunk";
                console.log( "ship is sunk" );
            }

            //result of shot
            result.status = "hit";
            result.ship = ship;
        }

        //log the shot to current player so opponent has access to shots against their ships
        const shotData = {
            cell: cellNum,
            status: result.status
        };
        if( currentPlayer === 1 ){
            shots.player1.push( shotData );
        }else{
            shots.player2.push( shotData );
        }


        //if all ships are sunk
        let sunkShips = ships.filter( ( s ) => {
            return s.status === "sunk";
        } );
        if( sunkShips.length === ships.length ){
            this.setState( {
                step: data.steps[ 2 ]
            } );
            return false;
        }

        //if not all ships are sunk, continue with the game
        //set delay so that players can switch
        else{
            this.switchPlayer( 750, true, shots );
            return result;
        }
    }


    /*
        TO DO
        Reset everything instead of simply reloading the page.
    */
    startOver(){
        window.location.reload();
    }


    render() {

        console.log( "app state:", this.state );
        return (
            <div className="main-wrap" data-state={ this.state.step }>
                <div className="topDownMessage switchPlayerMessage flex flex-column justify-center vertical-center" data-state={ this.state.showSwitchMessage} >
                    <h1 className="headline">Switch to Player { this.state.activePlayer === 1 ? 2 : 1 }</h1>
                    <Button text="Go" clickHandler={ this.playerSwitchComplete } color="gray"/>
                </div>
                <section className="board-group" data-activeplayer={ this.state.activePlayer }>
                    <Board
                        player="1"
                        stepCompleteHandler={ this.stepComplete }
                        shotHandler={ this.shotStatus }
                        turnComplete={ this.switchPlayer }
                        opponentShots={ this.state.shots.player2 }
                    />
                    <Board
                        player="2"
                        stepCompleteHandler={ this.stepComplete }
                        shotHandler={ this.shotStatus }
                        turnComplete={ this.switchPlayer }
                        opponentShots={ this.state.shots.player1 }
                    />
                </section>
                <div className="topDownMessage winner flex flex-column justify-center vertical-center">
                    <h1 className="headline">Player { this.state.activePlayer } is the winner!</h1>
                    <Button text="Play Again" clickHandler={ this.startOver } color="gray"/>
                </div>
            </div>
        );
    }
}

export default App;
