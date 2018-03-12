/*
	Create an array of numbers
*/
export const createArrayOfNumbers = ( start, number ) => [...( function*(){ let i = start; while( i < ( number + start ) ) yield i++; } )() ];
