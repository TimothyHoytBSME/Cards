
const heart = document.createElement('div')
const diamond = document.createElement('div')
const club = document.createElement('div')
const spade = document.createElement('div')
const card = document.createElement('div')

heart.innerHTML = `♥`
diamond.innerHTML = `♦`
club.innerHTML = `♣`
spade.innerHTML = `♠`

heart.className = "heart suit red"
diamond.className = "diamond suit red"
club.className = "club suit black"
spade.className = "spade suit black"
card.className = "card"

/////////
//  facecards
/////////

const numcards = [];

for(let i=2; i<=10; i++){
    //suit grid positions per num,[[row,col],[row,col]] 
    const pos = [];
    if(i===2) pos.push([1,2],[7,2]);
    if(i===3) pos.push([1,2],[4,2],[7,2]);
    if(i===4) pos.push([1,1],[1,3],[7,1],[7,3]);
    if(i===5) pos.push([1,1],[1,3],[4,2],[7,1],[7,3]);
    if(i===6) pos.push([1,1],[1,3],[4,1],[4,3],[7,1],[7,3]);
    if(i===7) pos.push([1,1],[1,3],[2,2],[4,1],[4,3],[7,1],[7,3]);
    if(i===8) pos.push([1,1],[1,3],[2,2],[4,1],[4,3],[6,2],[7,1],[7,3]);
    if(i===9) pos.push([1,1],[1,3],[3,1],[3,3],[4,2],[5,1],[5,3],[7,1],[7,3]);
    if(i===10) pos.push([1,1],[1,3],[2,2],[3,1],[3,3],[5,1],[5,3],[6,2],[7,1],[7,3]);

    //suits
    for(let j=0; j<4; j++){
        const ind = i-2+9*j;
        const suit = suitName(j);
        numcards[ind] = card.cloneNode(true)
        numcards[ind].id = "card-"+i.toString()+"-"+suit
        document.body.appendChild(numcards[ind])
        
        //per suit
        switch(suit){
            case "heart":
                populate(numcards[ind], i, heart, pos, "red")
                break;
            case "diamond":
                populate(numcards[ind], i, diamond, pos, "red")
                break;
            case "club":
                populate(numcards[ind], i, club, pos, "black")
                break;
            case "spade":
                populate(numcards[ind], i, spade, pos, "black")
                break;
        }
    }
}

//number card populate
function populate(cc, num, ss, pos, col){
    for(var k=0; k<pos.length; k++){
        const pip = ss.cloneNode(true)
        pip.style.gridRow = pos[k][0]
        pip.style.gridColumn = pos[k][1]
        if(pos[k][0]>4){
            pip.classList.add("flip")
        }
        cc.appendChild(pip)
    }

    doCorners(cc, num.toString(), ss, col);
}


/////////
//  facecards
/////////

const facecards = [];

for(let i=0; i<4; i++){
    //0: jack, 1: queen, 2: king, 3: ace
    for(let j=0; j<4; j++){
        //suit
        const ind = i+4*j;
        const suit = suitName(j);
        const val = (i===0)? "J" : (i===1)? "Q" : (i===2)? "K" : "A"
        facecards[ind] = card.cloneNode(true)
        facecards[ind].id = "card-"+val+"-"+suit
        facecards[ind].classList.add("face");
        document.body.appendChild(facecards[ind])

        switch(suit){
            case "heart":
                doCorners(facecards[ind], val, heart, "red")
                break;
            case "diamond":
                doCorners(facecards[ind], val, diamond, "red")
                break;
            case "club":
                doCorners(facecards[ind], val, club, "black")
                break;
            case "spade":
                doCorners(facecards[ind], val, spade, "black")
                break;
        }
    }
}

////////
//layout helpers
////////

function suitName(n){
    return (n===0)? "heart" : (n===1)? "diamond" : (n===2)? "club" : "spade"
}

function doCorners(cc, val, ss, col){
    const numdiv = document.createElement('div')
    numdiv.innerHTML = val
    numdiv.className = "numdiv "+"num"+val;
    cc.appendChild(numdiv)

    const theSuit = ss.cloneNode(true)
    theSuit.classList.add("thesuit")
    numdiv.appendChild(theSuit)

    
    const numdiv2 = numdiv.cloneNode(true)
    numdiv2.classList.add("flip")
    cc.appendChild(numdiv2)

    numdiv.classList.add(col)
    numdiv2.classList.add(col)

    if(val==="A"){
        const pip = ss.cloneNode(true)
        pip.style.gridRow = 4
        pip.style.gridColumn = 2
        cc.appendChild(pip)
    }
}

////////
//    actions
////////


const allCards =[...numcards,...facecards]

getZIndex = function (e,i) {      
 var z = document.defaultView.getComputedStyle(e[i]).getPropertyValue('z-index');
  return z; 
};

function getMaxZIndex() {
    return Math.max(
      ...Array.from(document.querySelectorAll('body *'), el =>
        parseFloat(window.getComputedStyle(el).zIndex),
      ).filter(zIndex => !Number.isNaN(zIndex)),
      0,
    );
  }

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

shuffle(allCards)

for(let c=0; c<allCards.length; c++){
    allCards[c].style.zIndex = 10+c;
    allCards[c].style.left = (c/50+1).toString()+"em"
    allCards[c].style.top = (c/100+1).toString()+"em"
    var myZIndex = getZIndex(allCards,c);
}







window.onload = addListeners;

var dragtarget = null;
var dragoffset = [0,0];

function addListeners(){
    const cards = document.querySelectorAll('.card');
    for(let i=0; i<cards.length; i++){
        cards[i].addEventListener('mousedown', mouseDown, false);
    }
    window.addEventListener('mouseup', mouseUp, false);
}

function mouseUp(e)
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
    window.addEventListener('mousemove', divMove, true);
    dragtarget = e.target;
    while(!dragtarget.className.includes("card")){
        dragtarget = dragtarget.parentElement;
    }
    if(dragtarget != null){
        dragtarget.style.zIndex = getMaxZIndex() + 1;
    }
    dragoffset = [ dragtarget.offsetLeft  - e.clientX  , dragtarget.offsetTop - e.clientY   ]
    console.log('dragging ',dragtarget.id)//, ' dragoffset', dragoffset)
    e.preventDefault();
}

function divMove(e){
    if(dragtarget != null){
        dragtarget.style.position = 'absolute';
        dragtarget.style.top = (dragoffset[1]+e.clientY) + 'px';
        dragtarget.style.left = (dragoffset[0]+e.clientX) + 'px';
    }
}