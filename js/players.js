//globals
let playerCount = 0;

//functions
export function getPlayer(name, id=getNextId(), scores=new Array(18)) {
    return {
        name: name,
        id: id,
        scores: scores
    };
}
function getNextId() {
    return playerCount++;
}