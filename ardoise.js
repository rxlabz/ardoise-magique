var feuille;
var crayon;
var input;
var commands = [];

var MSG_ERROR_BASE = "l'instruction semble contenir une erreur : ";

function initCanvas() {
    console.log("initCanvas()...");

    input = document.getElementById("input");
    feuille = document.getElementById("feuille");
    crayon = feuille.getContext("2d");

    crayon.strokeStyle = "rgb(0,0,0)";

}

function areSet(args) {
    var args = Array.prototype.slice.call(arguments);
    console.log("areSet()...", args);

    var res = true;
    args.forEach(function (arg) {
        if (res != false) {
            console.log("arg", arg);
            res = (typeof arg != "undefined");
        }
    });

    return res;
}

function trait(ax, ay, bx, by, color) {
    console.log('trait()...',ax, ay, bx, by, color);

    if (!areSet(ax, ay, bx, by))
        throw new Error("parametres incorrects");

    updateColor(color);
    crayon.beginPath();
    crayon.moveTo(ax, ay);
    crayon.lineTo(bx, by);
    crayon.stroke();
}

function rect(ax, ay, bx, by, color) {
    console.log('rect()...',ax, ay, bx, by, color);

    if (!areSet(ax, ay, bx, by))
        throw new Error("parametres incorrects");

    updateColor(color);
    crayon.strokeRect(ax, ay, bx, by);
}

function updateColor(c) {
    console.log('updateColor', c);

    switch (c) {
        case "r":
            crayon.strokeStyle = "rgb(255,0,0)";
            break;
        case "v":
            crayon.strokeStyle = "rgb(0,255,0)";
            break;
        case "b":
            crayon.strokeStyle = "rgb(0,0,255)";
            break;
        case "j":
            crayon.strokeStyle = "rgb(255,255,0)";
            break;
        case "o":
            crayon.strokeStyle = "rgb(255,200,0)";
            break;
        default:
            crayon.strokeStyle = "rgb(0,0,0)";
    }

    return crayon;
}

function rond(centreX, centreY, rayon, color) {

    if (!areSet(centreX, centreY, rayon))
        throw new Error("parametres incorrects");
    console.log('rond » x:', centreX, 'y', centreY, 'rayon', rayon);

    crayon = updateColor(color);

    crayon.beginPath();
    crayon.moveTo(centreX, centreY - rayon);
    crayon.arcTo(centreX + rayon, centreY - rayon, centreX + rayon, centreY, rayon);
    crayon.arcTo(centreX + rayon, centreY + rayon, centreX, centreY + rayon, rayon);
    crayon.arcTo(centreX - rayon, centreY + rayon, centreX - rayon, centreY, rayon);
    crayon.arcTo(centreX - rayon, centreY - rayon, centreX, centreY - rayon, rayon);
    crayon.stroke();
}

function clearInput() {
    input.value.replace(/\n/g, '');
    input.value = '';
    /*input.setSelectionRange(0,0);*/
    setCaretPosition(input, 0);
    console.log('clearInput', input.value);
}

function execute(command) {
    try {
        eval(command);
    } catch (e) {
        console.log("Erreur", e);
        showError("l'instruction semble contenir une erreur : " + e);
        //alert("l'instruction semble contenir une erreur : " + e);
        return;
    }

    showError('');
    clearInput();
}

function showError(msg) {
    var msgBox = document.getElementById("errorDisplay");
    if (msg != '')
        msgBox.style.display = 'block';
    else
        msgBox.style.display = 'none';

    msgBox.textContent = msg;
}

function onKeyPressed(e) {
    var keycode = e.keyCode ? e.keyCode : e.which;
    console.log('onKeyPressed...', keycode);
    if (keycode === 13)
        execute(input.value);
}

function efface() {
    crayon.clearRect(0, 0, feuille.width, feuille.height);
    clearInput();
}

function annule() {
    crayon.clearRect(0, 0, feuille.width, feuille.height);
    clearInput();
}

function setCaretPosition(ctrl, pos) {
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}