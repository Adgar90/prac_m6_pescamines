let files = 10;
let cols = 10;
let bandera = "img/badera20px.jpg";
let fons = "img/fons20px.jpg";
let haGuanyat = false;

let hores = 0;
let minuts = 0;
let segons = 0;
let interval;
let minesPartida = 0;
function iniciarPartida() {
    // reset
    document.getElementById("taulell").innerHTML = "";
    resetValors();
    // demanem les files i les columnes
    let valorFiles = parseInt(prompt("Introdueix les files (min. 10)"));
    let valorCols = parseInt(prompt("Introdueix les columnes (min. 10)"));
    
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
    contadorMines(minesPartida);
    interval = setInterval(iniciaContador, 1000);
    document.oncontextmenu = inhabilitar
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
       disableOnclick("hasMort()");
       clearInterval(interval); 
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
            disableOnclick("hasGuanyat()");
            clearInterval(interval);  
        }
    }
}
// activa aleatoriament un 17% de les mines
function setMines() {
    let numMines = Math.round(files*cols*0.17);
    minesPartida = numMines;
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
    setNumColor(document.getElementById(`td${x}-${y}`));
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
function disableOnclick(funcio) {
    for (let i=0; i<files; i++){
        for (let j=0; j<cols; j++) {
            let img = document.getElementById(`img${i}-${j}`);
            if (img) {
                img.setAttribute("onclick", funcio);
            }
        }
    }
}
// funció que mostra un alert indican que el jugador ha perdut
function hasMort() {
    alert('Has mort! Per jugar, inicia una nova partida');
}
function hasGuanyat() {
    alert('Has guanyat! Per jugar, inicia una nova partida');
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
// funció que permet a l'usuari marcar amb un 'flag' la casella sense obrir-la
function setBandera(x, y) {
    let img = document.getElementById(`img${x}-${y}`);
    if (img.src.includes(fons)) {
        img.src = bandera;
        minesPartida--;
        contadorMines(minesPartida);
    } else {
        img.src = fons;
        minesPartida++;
        contadorMines(minesPartida);
    }
}
// funcio que retorna les files i les cols a 10
function resetValors() {
    if(interval) { clearInterval(interval); } // comprovem si està setejat l'interval per resetejar-ho
    hores = 0;
    minuts = 0;
    segons = 0;
    minesPartida = 0;
    files = 10;
    cols = 10;
    
}
// funcio que seteja el color del nMinesAdjacents
function setNumColor(td) {
    let num = td.dataset.minesAdjacents;
    switch (num) {
        case "0":
            td.style.color = "darkmagenta";
            break;
        case "1":
            td.style.color = "blue";
            break;
        case "2":
            td.style.color = "green";
            break;
        case "3":
            td.style.color = "red";
            break;
        case "4":
            td.style.color = "darkblue";
            break;
        case "5":
            td.style.color = "forestgreen";
            break;
        case "6":
            td.style.color = "indianred";
            break;
        case "7":
            td.style.color = "violet";
            break;
    }
}

// funció que ens permet setejar un interval per tal de crear un contador
// aquest interval ens permetrà anar afegint +1 per cada segon que passa i mostrar-ho
function iniciaContador() {
    /* lògica per comprovar el timer i evaluar si hem de mostrar hores, minuts, segons */
    if (segons > 59) { segons = 0; minuts++; }
    if (minuts > 59) { minuts = 0; hores++; }
    if (hores > 23) { 
        segons = 0;
        minuts = 0;
        hores = 0;
    }
    document.getElementById("contador").innerHTML = mostraTimer();
    segons++;
}

//funció per mostrar com a string concatenat en format 00:00:00
function mostraTimer() {
    let h = hores < 10 ? `0${hores}` : hores;
    let m = minuts < 10 ? `0${minuts}` : minuts;
    let s = segons < 10 ? `0${segons}` : segons;
    return `${h}:${m}:${s}`;
}

// funció que mostra el nombre de mines que hi ha al taulell
function contadorMines(nMines) {
    let div = document.getElementById("numMines");
    div.innerHTML = nMines > 0 ? nMines : 0;
    let img = document.createElement("img");
    img.src = "img/mina20px.jpg";
    div.appendChild(img);
}

// funció que ens deshabilita el menu contextual dins del nostre pescamines per poder fer servir ambdós botons sense problemes
function inhabilitar(e) {
    e.preventDefault();
  }
        