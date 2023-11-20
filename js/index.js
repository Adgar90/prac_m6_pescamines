let files = 10;
let cols = 10;
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
            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("taulell").appendChild(table);
}

// mètode per obrir les caselles
function obreCasella(x, y) {
    // TODO
    if (esMina(x, y)) { 
       mostraMines();
    } else {
        let adjacents =  document.getElementById(`td${x}-${y}`).getAttribute("data-mines-adjacents");
        document.getElementById(`td${x}-${y}`).setAttribute("data-state", "open");
        if (adjacents == 0) {
            mostraAdjacents(x, y);
        } else {
            document.getElementById(`td${x}-${y}`).innerHTML = adjacents;
        }
    }
}
// activa aleatoriament un 17% de les mines
function setMines() {
    for (let i=0; i<files; i++) {
        for (let j=0; j<cols; j++) {
            let random = Math.round(Math.random()*100);
            if (random <= 17) { document.getElementById(`td${i}-${j}`).setAttribute("data-mina", "true"); }
        }
    }
}
// funció que recorrerà el taulell i apuntarà el número de mines adjacents de cada casella en una custom html property data-num-mines inicialment a cero.
function calculaAdjacents() {
    // TODO:
    let quantesMines = 0;
    for (let i=0; i<files; i++){
        for (let j=0; j<cols; j++) {
            for (let row=i-1; row<=i+1; row++) {
                for(let col=j-1; col<=j+1; col++) {
                    let check = document.getElementById(`td${row}-${col}`);
                    if (check) {
                        if (check.getAttribute("data-mina") == "true") { quantesMines++; }
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
    // TODO:
    document.getElementById(`td${x}-${y}`).setAttribute("data-mines-adjacents", nMinesAdjacents);       
}
// funció que torna un boleà de si la posició x,y hi ha una mina
function esMina(x, y) {
    // TODO:
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
function mostraAdjacents(x, y) {
    for (let i=x-1; i<=x+1; i++) {
        for(let j=y-1; j<=y+1; j++) {
            let casella = document.getElementById(`td${i}-${j}`);
            if (casella) {
                if (casella.dataset.minesAdjacents == 0 && casella.dataset.state != "open") {
                    casella.innerHTML = casella.dataset.minesAdjacents;
                    casella.setAttribute("data-state", "open");
                    mostraAdjacents(i, j);
                } else {
                    casella.innerHTML = casella.dataset.minesAdjacents;
                }
            }
        }
    }
}