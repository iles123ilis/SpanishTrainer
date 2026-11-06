const TensesDatabase = {
    Presente: {
        title: "Presente",
        forms: [
            { pronoun: "Yo", answer: "hablo" },
            { pronoun: "Tú", answer: "hablas" },
            { pronoun: "Él/Ella", answer: "habla" },
            { pronoun: "Nosotros", answer: "hablamos" },
            { pronoun: "Vosotros", answer: "habláis" },
            { pronoun: "Ellos/Ellas", answer: "hablan" },
        ]

    },
    PreteritoIndefinido: {
        title: "Pretérito Indefinido",
        forms: [
            { pronoun: "Yo", answer: "hablé" },
            { pronoun: "Tú", answer: "hablaste" },
            { pronoun: "Él/Ella", answer: "habló" },
            { pronoun: "Nosotros", answer: "hablamos" },
            { pronoun: "Vosotros", answer: "hablasteis" },
            { pronoun: "Ellos/Ellas", answer: "hablaron" },
        ]
    },
    PreteritoImperfecto: {
        title: "Pretérito Inmerfecto",
        forms: [
            { pronoun: "Yo", answer: "hablaba" },
            { pronoun: "Tú", answer: "hablabas" },
            { pronoun: "Él/Ella", answer: "hablaba" },
            { pronoun: "Nosotros", answer: "hablábamos" },
            { pronoun: "Vosotros", answer: "hablabais" },
            { pronoun: "Ellos/Ellas", answer: "hablaban" },
        ]
    },
    FuturoSimple: {
        title: "Futuro Simple",
        forms: [
            { pronoun: "Yo", answer: "hablaré" },
            { pronoun: "Tú", answer: "hablarάs" },
            { pronoun: "Él/Ella", answer: "hablarά" },
            { pronoun: "Nosotros", answer: "hablaremos" },
            { pronoun: "Vosotros", answer: "hablaréis" },
            { pronoun: "Ellos/Ellas", answer: "hablarάn" },
        ]
    },
    CondicionalSimple: {
        title: "Condicional Simple",
        forms: [
            { pronoun: "Yo", answer: "hablaría" },
            { pronoun: "Tú", answer: "hablarías" },
            { pronoun: "Él / Ella", answer: "hablaría" },
            { pronoun: "Nosotros", answer: "hablaríamos" },
            { pronoun: "Vosotros", answer: "hablaríais" },
            { pronoun: "Ellos / Ellas", answer: "hablarían" }
        ]
    }
};

let activeQuestions = [];
let currentIndex = 0;
let scoreCorrect = 0;
let scoreIncorrect = 0; 

const cardPronoun = document.getElementById("textNoun"); // Местоимение 
const cardTenseTag = document.getElementById("card-tense-tag"); // Название времени на карточке
const inputField = document.getElementById("user-input"); // поле ввода
const checkButton = document.getElementById("random-btn"); // кнопка
const correctSpan = document.getElementById("correct-count"); // счетчик правильных ответов
const incorrectSpan = document.getElementById("incorrect-count"); // счетчик неправильных ответов
const resultMessage = document.getElementById("result-message"); // результат
const tenseCheckboxes = document.querySelectorAll('.task-list input[type="checkbox"]'); //выбранные времена
const dropdownBtn = document.getElementById("SelectTenses"); // кнопка выбора времени
const dropdownMenu = document.getElementById("dropTenses"); // контейнер списка временей для выбора 
const modalPopup = document.getElementById("modal-popup"); // контейнер затемнения у справочника
const closeModal = document.getElementById("close-modal"); // кнопка закрытия
const Tenseguide = document.getElementById("Tenseguide"); // кнопка справочника
const modalContent = document.querySelector(".modal-content"); // контейнер справочника
const modalTenseContainer = document.getElementById("modal-tense-container"); // контейнер надписей времени в справочнике
const resultContainer = document.querySelector(".result-message-container");
const dsigns = document.getElementById("dsigns"); // кнопка диакритических знаков
const accentMenu = document.getElementById("accent-menu"); // меню кнопок 
const buttonAccents = document.querySelectorAll(".letter-btn"); // кнопки з диакритическими знакам


function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//показать или скрыть меню кнопкой
dropdownBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});
// скрыть меню
document.addEventListener("click", (event) => {
    if (
        !dropdownMenu.contains(event.target) && // если мы не нажали по выпадающему окну и 
        !dropdownBtn.contains(event.target) // если мы не нажали на кнопку 
    ) {
        dropdownMenu.style.display = "none";
    }
}); // обновить активные карточки
function updateActiveQuestions() {
    activeQuestions = [];

    tenseCheckboxes.forEach(checkbox => {
        if (checkbox.checked && TensesDatabase[checkbox.id]) {
            const key = checkbox.id;
            TensesDatabase[key].forms.forEach(item => {
                activeQuestions.push({
                    pronoun: item.pronoun,
                    answer: item.answer,
                    tenseTitle: TensesDatabase[key].title
                });
            });

        }
    }
    );
    if (activeQuestions.length === 0) {
        document.getElementById("Presente").checked = true;
        updateActiveQuestions();
        return;
    }
    getRandomIndex();
    showCurrentCard();
}
// рандомній индекс
function getRandomIndex() {
    let prevIndex = currentIndex;
    do {
        if (activeQuestions.length > 1) {
            currentIndex = Math.floor(Math.random() * activeQuestions.length);
        }

        else if (activeQuestions.length === 0 || activeQuestions.length === 1) {
            currentIndex = 0;
            return;
        }
       
    } while (currentIndex === prevIndex)
}
// вывести местоимение и время 
function showCurrentCard() {
    let currentQ = activeQuestions[currentIndex];
    cardPronoun.textContent = currentQ.pronoun;
    cardTenseTag.textContent = currentQ.tenseTitle;
}
checkButton.addEventListener("click", () => {
    const formVerb = removeAccents(inputField.value.trim().toLowerCase());
    if (formVerb === "") {
        return;
    }
    checkButton.disabled = true;
    const currentCard = activeQuestions[currentIndex];
    let currentCardWA = currentCard.answer;
    currentCardWA = removeAccents(currentCardWA);
    if (currentCardWA === formVerb) {
            scoreCorrect++;
            correctSpan.textContent = scoreCorrect;
            inputField.style.backgroundColor = 'lightgreen';
        resultMessage.style.opacity = "1"; // Показать сообщение
            setTimeout(() => {
                inputField.style.backgroundColor = '';
                resultMessage.textContent = '';
                inputField.value = "";
                getRandomIndex();
                showCurrentCard();
                inputField.focus(); 
                resultContainer.style.display = "none";
                resultMessage.style.opacity = "0";
                checkButton.disabled = false;
}, 500);
        }
        else {
            scoreIncorrect++;
            incorrectSpan.textContent = scoreIncorrect;
            inputField.style.backgroundColor = 'lightred';
            resultMessage.style.color = 'red';
        resultMessage.textContent = currentCard.answer;
        resultMessage.style.opacity = "1";
        resultContainer.style.display = "block";
        resultContainer.style.backgroundColor = '#fecaca';
            setTimeout(() => {
                inputField.style.backgroundColor = '';
                resultMessage.textContent = '';
                inputField.value = "";
                resultMessage.style.opacity = "0";
                resultContainer.style.display = "none";
                inputField.focus();
                checkButton.disabled = false;
               }, 1000);
        }
    
}); 

// Обновляем карточки при изменении выбранных времён
tenseCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", updateActiveQuestions);
});



// Открываем справочник
Tenseguide.addEventListener("click", (event) => {
    event.stopPropagation();

    if (modalPopup.style.display === "flex") {
        modalPopup.style.display = "none";
    } else {
        updateModalContent();
        modalPopup.style.display = "flex";
    }
});
// скрыть справочник
document.addEventListener("click", (event) => {
    if (
        !modalContent.contains(event.target) && // если мы не нажали по выпадающему окну и 
        !Tenseguide.contains(event.target) // если мы не нажали на кнопку 
    ) {
        modalPopup.style.display = "none";
    }
});
// закрыть справочник
closeModal.addEventListener("click", (event) => {
    event.stopPropagation();
    modalPopup.style.display = "none";
});
/*закрытие по затемненой области*/
modalPopup.addEventListener("click", function (e) {
    if (e.target === modalPopup) {
        modalPopup.style.display = "none";
    }
});
/*обновление содержимое контента*/ 
function updateModalContent() {
    modalTenseContainer.innerHTML = "";
    tenseCheckboxes.forEach(checkbox => {
        if (checkbox.checked && TensesDatabase[checkbox.id]) {
            const data = TensesDatabase[checkbox.id];
            const div = document.createElement("div");
            div.className = "tense-block";
            let html = `<div class="tense-title">${data.title}</div><ul>`;
            data.forms.forEach(f => {
                html += `<li><strong>${f.pronoun}</strong> — ${f.answer}</li>`;
            });
            html += `</ul>`;
            div.innerHTML = html;
            modalTenseContainer.appendChild(div);
        }
    });
}
inputField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkButton.click();
});
//кнопка диакритических знаков 
dsigns.addEventListener("click", function () {
    if (accentMenu.style.display === "flex") {
        accentMenu.style.display = "none";
    }
    else { accentMenu.style.display = "flex"; }
    inputField.focus();
});

buttonAccents.forEach(letter => {
    letter.addEventListener("click", () => {
        inputField.value += letter.textContent;
        inputField.focus();
    });
});

// Показываем первую карточку при запуске сайта
updateActiveQuestions();