let files = 10;
let cols = 10;
let bandera = "img/badera20px.jpg";
let fons = "img/fons20px.jpg";
let haGuanyat = false;
function iniciarPartida() {
    // demanem les files i les columnes
    let valorFiles = parseInt(prompt("Introdueix les files (min. 10)"));
    let valorCols = parseInt(prompt("Introdueix les columnes (min. 10)"));
    
    // reset
    document.getElementById("taulell").innerHTML = "";
    
    if (valorFiles >= 10 && valorFiles <= 30) {
        files = valorFiles;
    } else {
        if (valorFiles > 30) { 
            files = 30; 
        }
    }
    
    
    if (valorCols >= 10 && valorCols <= 30) {
        cols = valorCols;
    } else {
        if (valorCols > 30) { 
            cols = 30; 
        }
    }
    creaTaulell();
    setMines();
    calculaAdjacents();
}

function creaTaulell() {
    // creem table <- tr(files) <- td(cols) (data-mina, img)
    let table = document.createElement("table");
    
    //td.appendChild(img);
    for (let i=0; i<files; i++) {
        let tr = document.createElement("tr");
        for (let j=0; j<cols; j++) {
            // creació de cel·les (cols) + setejament d'atributs
            let td = document.createElement('td');
            td.id = `td${i}-${j}`;
            td.setAttribute("data-mina", "false");
            // creació d'img per fons + setejament d'atributs
            let img = document.createElement('img');
            img.id = `img${i}-${j}`;
            img.src="img/fons20px.jpg";
            img.setAttribute("onclick", `obreCasella(${i}, ${j})`);
            img.setAttribute("oncontextmenu", `setBandera(${i}, ${j})`);
            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("taulell").appendChild(table);
}

// mètode per obrir les caselles
function obreCasella(x, y) {
    if (esMina(x, y)) { 
       mostraMines();
       haGuanyat = false;
       alert('Has mort!'); 
       disableOnclick(); 
    } else {
        let adjacents =  document.getElementById(`td${x}-${y}`).dataset.minesAdjacents;
        document.getElementById(`td${x}-${y}`).dataset.state = "open";
        if (adjacents == 0) {
            mostraAdjacents(x, y);
        } else {
            document.getElementById(`td${x}-${y}`).innerHTML = adjacents;
        }
        if (comprovaSiGuanya()) {
            mostraMines();
            haGuanyat = true;
            alert('Has guanyat!');
        }
    }
}
// activa aleatoriament un 17% de les mines
function setMines() {
    let numMines = Math.round(files*cols*0.17);
    while (numMines > 0) {
        let td = document.getElementById(`td${Math.floor(Math.random()*files)}-${Math.floor(Math.random()*cols)}`);
        if (td.dataset.mina == "true") { continue; } // si la mina ja ha sigut assignada, fem continue per buscar una que no
        td.dataset.mina = "true";
        numMines--;
    }
}
// funció que recorrerà el taulell i apuntarà el número de mines adjacents de cada casella en una custom html property data-num-mines inicialment a cero.
function calculaAdjacents() {
    let quantesMines = 0;
    for (let i=0; i<files; i++){
        for (let j=0; j<cols; j++) {
            for (let row=i-1; row<=i+1; row++) {
                for(let col=j-1; col<=j+1; col++) {
                    let check = document.getElementById(`td${row}-${col}`);
                    if (check) {
                        if (check.dataset.mina == "true") { quantesMines++; }
                    }
                }
            }
            setMinesAdjacents(i, j, quantesMines);
            quantesMines = 0;
        }
    } 
}
// funció que estableix a la casella de posició x,y l’atribut del número de mines a nMinesAdjacents
function setMinesAdjacents(x, y, nMinesAdjacents) {
    document.getElementById(`td${x}-${y}`).dataset.minesAdjacents = nMinesAdjacents;       
}
// funció que torna un boleà de si la posició x,y hi ha una mina
function esMina(x, y) {
    let mina = document.getElementById(`td${x}-${y}`);
    if (mina.dataset.mina == "true") { return true; }
    return false;
}
function mostraMines() {
    for (let i=0; i<files; i++){
        for (let j=0; j<cols; j++) {
            if (esMina(i, j)) { 
                document.getElementById(`img${i}-${j}`).src = "img/mina20px.jpg";
            }
        }
    }
}
// funció que mostra les mines adjacents i mostra el nombre que hi ha
// si es 0 desbloca les caselles adjacents i segueix fent-ho sempre i quan siguin 0 (recursiu)
function mostraAdjacents(x, y) {
    for (let i=x-1; i<=x+1; i++) {
        for(let j=y-1; j<=y+1; j++) {
            let casella = document.getElementById(`td${i}-${j}`);
            if (casella) {
                if (casella.dataset.minesAdjacents == 0 && casella.dataset.state != "open") {
                    casella.innerHTML = casella.dataset.minesAdjacents;
                    casella.dataset.state = "open";
                    mostraAdjacents(i, j);
                } else {
                    casella.dataset.state = "open";
                    casella.innerHTML = casella.dataset.minesAdjacents;
                }
            }
        }
    }
}
// funció que deshabilita el primer onclick assignat
// assigna un nou onclick que mostra un alert conforme el jugador ha perdut
function disableOnclick() {
    for (let i=0; i<files; i++){
        for (let j=0; j<cols; j++) {
            let img = document.getElementById(`img${i}-${j}`);
            if (img) {
                img.setAttribute("onclick", "hasMort()");
            }
        }
    }
}
// funció que mostra un alert indican que el jugador ha perdut
function hasMort() {
    alert('Has mort! Per jugar, inicia una nova partida');
}
// funció que comprova la data del taulell per saber si el jugador ha guanyat
function comprovaSiGuanya() {
    for (let i=0; i<files; i++){
        for (let j=0; j<cols; j++) {
            let td = document.getElementById(`td${i}-${j}`);
            if (td.dataset.mina == "false" && td.dataset.state == undefined) {
                return false;
            }
        }
    }
    return true;
}

function setBandera(x, y) {
    let img = document.getElementById(`img${x}-${y}`);
    if (img.src.includes(fons)) {
        img.src = bandera;
    } else {
        img.src = fons;
    }
}