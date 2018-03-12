/*
	Get Siblings of a DOM Node
*/
export function GetSiblings( el ){
	var siblings = [];
	var sibling = el.parentNode.firstChild;
	for( ; sibling; sibling = sibling.nextSibling ){
		if( sibling.nodeType !== 1 || sibling === el ){
			continue;
		}
		siblings.push( sibling );
	}
	return siblings;
};
