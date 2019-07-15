let correctAnswer,
    countCorrect = (localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0),
    countIncorrect = (localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);

document.addEventListener('DOMContentLoaded', function(){
    // console.log('ready');
    loadQuestion();
    btnOnClickEvents();
});


btnOnClickEvents = () => {
    document.querySelector('#submit').addEventListener('click', validateAnswer);
    document.querySelector('#reset').addEventListener('click', clearLocalStorageResults);
}



//loads a new question from an API
loadQuestion = () => {
    // console.log('from load question');
    const url = 'https://opentdb.com/api.php?amount=1';
    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestion(result.results)           
    );
}

//display the question html from api
displayQuestion = questions => {
    
    //create the html question
    const questionHtml = document.createElement('div');
    // questionHtml.classList.add('col-12');

    questions.forEach(question => {
        console.log(question);

        //add question for this question
        questionHtml.innerHTML = `
        <div class="heading">
            <p class="category">Category: ${question.category}</p>
            <div class="totals">
                <span class="badge badge-success">${countCorrect}</span>
                <span class="badge badge-danger">${countIncorrect}</span>
            </div>
        </div>
        <h2 class="text-center">${question.question}</h2>`;


        //store the correct answer from the api
        correctAnswer = question.correct_answer;

        //store the incorrect answers with the correct
        //answers to create an array in which to store the
        //possible questions for each question
        let possibleAnwsers = question.incorrect_answers;
        possibleAnwsers.splice( Math.floor(Math.random() * 3), 0, correctAnswer);
        // console.log(possibleAnwsers);
        // console.log(question);

        //generate the html for the possible answers
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('questions');
        possibleAnwsers.forEach(answer => {
            const anwserHtml = document.createElement('li')
            // anwserHtml.classList.add('col-12', 'col-md-5');
            anwserHtml.textContent = answer;

            //attach a click event to the selected answer by executing a function in this instance a function called selectAnswer
            anwserHtml.onclick = selectAnswer;


            answerDiv.appendChild(anwserHtml);
        });
        questionHtml.appendChild(answerDiv);

        //append to parent html to render block to screen
        document.querySelector('#app').appendChild(questionHtml);
    })
}


//when the answer is selected 
selectAnswer = (e) => {
    // console.log(e.target);

    //removes previous active class if an answer was already selected
    if(document.querySelector('.active')){
        const activeAnswer = document.querySelector('.active');
        activeAnswer.classList.remove('active');
    };

    //add active to class to create the activeAnswer
    e.target.classList.add('active');
}


//checks if selected answer is correct and an answer is selected
validateAnswer = () => {
    //if an question has a class of active it means that at least one has been selected
    //so check if the selected answer is the correct answer
    if(document.querySelector('.questions .active')){
        checkAnswer();
    } else{
        //no answer has been selected
        const errDiv = document.createElement('div');
        errDiv.classList.add('alert-error', 'text-center' );
        errDiv.textContent = "pls select an answer";
        const questionDiv = document.querySelector('.questions');
        questionDiv.appendChild(errDiv);

        //remove error
        setTimeout(() => {
            document.querySelector('.alert-error').remove();
        }, 3000);
    }
}

//check if selected answer = correct answer
checkAnswer = () => {
    const userAnswer = document.querySelector('.questions .active');
    // console.log(userAnswer.textContent);

    // console.log(correctAnswer);
    if(userAnswer.textContent === correctAnswer){
        countCorrect++;
    } else {
        countIncorrect++;
    }
    //save results in local storage
    saveToLocalStorage();


    //clear current question
    const app = document.querySelector("#app");
   
     while(app.firstChild){
         app.removeChild(app.firstChild);
     }


    //load next question
    loadQuestion();
}

saveToLocalStorage = () => {
    localStorage.setItem('quiz_game_correct', countCorrect);
    localStorage.setItem('quiz_game_incorrect', countIncorrect);

}

clearLocalStorageResults = () => {
    localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect', 0);

    setTimeout(() => {
        window.location.reload();
    }, 500);
}