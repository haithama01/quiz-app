// Element selector

let spans = document.querySelector(".quiz-app .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button")
let rightAswerSpan = document.querySelector(".right-answer")
let bullets = document.querySelector(".bullets")
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
// Set Options
let currentIndex = 0;
let rightAswer = 0;
let countDownInterval;

function getQuestions() { 
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () { 
        if (this.readyState === 4 && this.status === 200) { 
            let questions = JSON.parse(this.responseText);
            let qCount = questions.length;
            document.querySelector(".quiz-app .count span").innerHTML = qCount;
            for (let i = 0; i < qCount; i++) {
                let theBullet = document.createElement("span");
                spans.appendChild(theBullet);
                if (i === 0) {
                    theBullet.className = "on";
                }
            }
            // Add question data.
            addQuestionData(questions[currentIndex], qCount);


            countDown(3,qCount);

            // click on submit 
            submitButton.onclick = function () {
                let theRightAnswer = questions[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(theRightAnswer, qCount);
                
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                addQuestionData(questions[currentIndex], qCount);

                // Handle bullets classes.
                handleBullets();
                clearInterval(countDownInterval)
                countDown(3,qCount);
                // showResut
                showResults(qCount);
            }
        }
    };
    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();

}
getQuestions();

function addQuestionData(obj,count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title)
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
        let myDiv = document.createElement("div");
        let myInput = document.createElement("input");
        let myLabel = document.createElement("label");

        

        myDiv.className = "answer";
        myInput.type = "radio";
        myInput.name = "answer";
        myInput.id = `answer_${i}`;
        myInput.dataset.answer = obj[`answer_${i}`];
        myLabel.htmlFor = `answer_${i}`;
        let labelText = document.createTextNode(obj[`answer_${i}`]);
        myLabel.appendChild(labelText);
        if (i === 1) {
            myInput.checked = true;
        }
        myDiv.appendChild(myInput);
        myDiv.appendChild(myLabel);
        answerArea.appendChild(myDiv)
    }
    }
}
function checkAnswer(rAnswer) {
    let answers = document.getElementsByName("answer");
    let theChossenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
        theChossenAnswer = answers[i].dataset.answer;
    }
    }
    if (rAnswer === theChossenAnswer) {
        rightAswer++;
    }
}
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
    let theResult;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAswer > (count / 2) && rightAswer < count) {
            theResult = `<span class = "good">Good</span> , ${rightAswer} from ${count}`;
        }
        else if (rightAswer === count) {
            theResult = `<span class = "perfect">perfect</span> , ${rightAswer} from ${count}`;
        }
        else{
            theResult = `<span class = "bad">bad</span> , ${rightAswer} from ${count}`;
        }
        results.innerHTML = theResult;
    }
}
function countDown(duration,count) {
    if (currentIndex < count) {
        countDownInterval = setInterval(() => {
            let minutes, seconds;
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countDownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
        }
        }, 1000);
        
    }
}