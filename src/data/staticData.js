export const data = {

    //app steps
    steps: [
        "placeships",
        "fire",
        "win"
    ],

    //size of boards
    boards: {
        rows: 8,
        columns: 8
    },

    //separate player ship data so eventually we could use different types and sizes of ships between players - as if simulating countries etc.
    player1Ships: [
        {
            name: "scout",
            length: 2
        },
        {
            name: "battleship",
            length: 3
        },
        {
            name: "carrier",
            length: 5
        }
    ],
    player2Ships: [
        {
            name: "scout",
            length: 2
        },
        {
            name: "battleship",
            length: 3
        },
        {
            name: "carrier",
            length: 5
        }
    ]
};
