var quiz;
let db = [];
let questionNumber = 0;
let punteggio = 0;
let tempo = 150;
let tempoDecrease = function(){
    if(tempo>0) tempo--;
    document.getElementById("tempo").innerHTML = tempo;
}
let timer;

async function getData(){
    if(questionNumber>=db.length){
        let response = await fetch("./test.json");
        let data = await response.json();
        data.results.forEach((question)=>{
            db.push({
                q: question.question,
                a: [question.correct_answer].concat(question.incorrect_answers)
            });
        });
    }
    return {q: db[questionNumber].q,a: [...db[questionNumber++].a]};
}

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

class Quiz{
    constructor(data){
        this.question = data.q;
        let correct_answer = data.a[0];
        this.answers = shuffle(data.a);
        this.gameEnded = false;
        this.tryAnswer = function(answer){
            if(this.gameEnded||tempo<=0) return;
            this.gameEnded = true;
            let bckg = answer.style.backgroundColor;
            answer.style.backgroundColor = "red";
            if(answer.innerHTML === correct_answer){
                answer.style.backgroundColor = "green";
                punteggio++;
            }
            clearInterval(timer);
            setTimeout(function(){
                answer.style.backgroundColor = bckg;
                loadGame();
            }, 1000);
        }
    }

    getHTML(){
        let html = '<article id="quiz" class="quiz">'+
            `<div id="question">${this.question}</div>`+
            '<p></p><div class = "risposte">'+
            `<button onClick="quiz.tryAnswer(this)">${this.answers[0]}</button><button onClick="quiz.tryAnswer(this)">${this.answers[1]}</button>`
        if(this.answers.length>2) html+=`<button onClick="quiz.tryAnswer(this)">${this.answers[2]}</button><button onClick="quiz.tryAnswer(this)">${this.answers[3]}</button>`
        html += '</div></article>'
        return html;
    }
}

async function loadGame(){
    quiz = new Quiz(await getData());
    document.getElementById("areaQuiz").innerHTML = quiz.getHTML();
    document.getElementById("score").innerHTML = punteggio;
    document.getElementById("tempo").innerHTML = tempo;
    timer = setInterval(tempoDecrease, 1000);
}

document.addEventListener('DOMContentLoaded', loadGame);