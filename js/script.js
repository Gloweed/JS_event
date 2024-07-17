"use strict"

//Параллакс эффект при движении мыши
window.onload = function () {
    const animationHeadline = document.querySelector('.animation-headline');

    if (animationHeadline) {
        const animationBg = document.querySelector('.animation-headline__bg');
        const animationFoliage = document.querySelector('.animation-headline__foliage');
        const animationLeaves = document.querySelector('.animation-headline__leaves');

        //Коэффициенты
        const forBg = 40;
        const forFoliage = 25;
        const forLeaves = 15;

        //Скорость анимации
        const speed = 0.05;

        //Координаты
        let positionX = 0, positionY = 0;
        let coordXprocent = 0, coordYprocent = 0;

        function setMouseParallaxStyle() {
            const distX = coordXprocent - positionX;
            const distY = coordYprocent - positionY;

            positionX = positionX + (distX * speed);
            positionY = positionY + (distY * speed);

            //Добавление стилей перемещения
            animationBg.style.cssText = `transform: translate(${positionX / forBg}%, ${positionY / forBg}%);`;
            animationFoliage.style.cssText = `transform: translate(${positionX / forFoliage}%, ${positionY / forFoliage}%);`;
            animationLeaves.style.cssText = `transform: translate(${positionX / forLeaves}%, ${positionY / forLeaves}%);`;

            requestAnimationFrame(setMouseParallaxStyle);
        }
        setMouseParallaxStyle();

        animationHeadline.addEventListener('mousemove', function (e) {
            const headlineWidth = animationHeadline.offsetWidth;
            const headlineHeight = animationHeadline.offsetHeight;

            const coordX = e.pageX - headlineWidth / 2;
            const coordY = e.pageY - headlineHeight / 2;

            coordXprocent = coordX / headlineWidth * 100;
            coordYprocent = coordY / headlineHeight * 100;
        });

        //Параллакс эффект при скроле
        const animationContent = document.querySelector('.animation-headline__content');

        let thresholdSets = [];
        for (let i = 0; i <= 1.0; i += 0.005) {
            thresholdSets.push(i);
        }

        const observer = new IntersectionObserver(function (entries, observer) {
            const scrollTopProcent = window.scrollY / animationHeadline.offsetHeight * 100;
            setParallaxItemStyle(scrollTopProcent);
        }, {
            threshold: thresholdSets
        });

        observer.observe(document.querySelector('.content'));

        function setParallaxItemStyle(scrollTopProcent) {
            animationContent.style.cssText = `transform: translate(0%, -${scrollTopProcent / 3}%);`;
            animationFoliage.parentElement.style.cssText = `transform: translate(0%, -${scrollTopProcent / 6}%);`;
            animationLeaves.parentElement.style.cssText = `transform: translate(0%, -${scrollTopProcent / 3}%);`;
        }
    }
}

//Анимация листьев
const leaves = document.querySelector('.animation-headline__leaves');

leaves.addEventListener('mousemove', function (e) {
    if (e.target.closest('.animation-headline__leaf')) {
        moveAnimationImage(e.target.closest('.animation-headline__leaf'), e.offsetX, e.offsetY);
    }
});

leaves.addEventListener('mouseout', function (e) {
    if (e.target.closest('.animation-headline__leaf')) {
        delAnimationImage(e.target.closest('.animation-headline__leaf'));
    }
});

//Функции анимации и её удаления
function moveAnimationImage(image, x, y) {
    let wh = image.offsetHeight / 2,
        ww = image.offsetWidth / 2;

    image.style.removeProperty('transition', 'all 0.5s linear 0s');
    image.style.setProperty('--mouseX', (x - ww) / 20 + "deg");
    image.style.setProperty('--mouseY', (wh - y) / 20 + "deg");
}

function delAnimationImage(image) {
    image.style.setProperty('transition', 'all 0.5s linear 0s');
    image.style.removeProperty('--mouseX');
    image.style.removeProperty('--mouseY');
}

//Отображение формы
const form = document.querySelector('.content__form');
const button = document.querySelector('.content__button');

document.addEventListener('click', function (event) {
    if (event.target.closest('.content__button')) {
        button.classList.toggle('_active');
        form.classList.toggle('_active');
    }

    if (!event.target.closest('.content__button') && !event.target.closest('.content__form')) {
        button.classList.remove('_active');
        form.classList.remove('_active');
    }
});

document.addEventListener('keydown', function (event) {
    if (event.code === "Escape") {
        button.classList.remove('_active');
        form.classList.remove('_active');
    }
});

//Взаимодействия с формой
//Email
const mainForm = document.forms.mainForm;
const mainFormEmail = mainForm.email;
const mainFormEmailPlaceholder = mainFormEmail.placeholder;
const emailDomain = "leaf.green";

mainFormEmail.addEventListener('input', addEmailDomain);

mainFormEmail.addEventListener('focus', function (e) {
    focusElementForm(e.currentTarget);
});
mainFormEmail.addEventListener('blur', function (e) {
    blurElementForm(e.currentTarget, mainFormEmailPlaceholder);
    addEmailDomain(e);
});

mainFormEmail.previousElementSibling.addEventListener('dblclick', function () {
    mainFormEmail.removeAttribute('disabled');
    mainFormEmail.previousElementSibling.classList.remove('_active');
});

function addEmailDomain(e) {
    let value = mainFormEmail.value;
    const atIndex = value.indexOf('@');

    if (atIndex !== -1) {
        const localPart = value.substring(0, atIndex);
        const domainPart = value.substring(atIndex);

        if (!domainPart.endsWith(emailDomain)) {
            value = localPart + domainPart.slice(0, 1) + emailDomain;
        }

        mainFormEmail.value = value;
        mainFormEmail.removeEventListener('input', addEmailDomain);
        mainFormEmail.setAttribute('disabled', true);
        mainFormEmail.previousElementSibling.classList.add('_active');
    }
}

//Password
const mainFormPassword = mainForm.greenName;
const mainFormPasswordPlaceholder = mainFormPassword.placeholder;

mainFormPassword.addEventListener('focus', function (e) {
    focusElementForm(e.currentTarget);
});
mainFormPassword.addEventListener('blur', function (e) {
    blurElementForm(e.currentTarget, mainFormPasswordPlaceholder);
    if (mainFormPassword.value !== '') {
        if (mainFormPassword.value.toLowerCase() === 'green') {
            mainFormPassword.classList.add('_active');
            mainFormPassword.classList.remove('_error');
        } else {
            mainFormPassword.classList.add('_error');
            mainFormPassword.classList.remove('_active');
        }
        mainFormPassword.addEventListener('input', CleaningStylePassword);
    }
});

//Функция очистки password
function CleaningStylePassword() {
    mainFormPassword.classList.remove('_error');
    mainFormPassword.classList.remove('_active');
    mainFormPassword.removeEventListener('input', CleaningStylePassword);
}

//Message
const mainFormMessage = mainForm.message;
const mainFormMessagePlaceholder = mainFormMessage.placeholder;

mainFormMessage.addEventListener('focus', function (e) {
    focusElementForm(e.currentTarget);
});
mainFormMessage.addEventListener('blur', function (e) {
    blurElementForm(e.currentTarget, mainFormMessagePlaceholder);
});

const textarea = document.querySelector('.main-form__textarea');
const textareaLimit = textarea.getAttribute('maxlength');
const textareaCounter = document.querySelector('.main-form__counter span');

textareaCounter.innerHTML = textareaLimit;

textarea.addEventListener('input', txtSetCounter);

function txtSetCounter() {
    const textareaResult = textareaLimit - textarea.value.length;
    textareaCounter.innerHTML = textareaResult;
}

const textareaNotice = document.querySelector('.main-form__counter');

mainFormMessage.addEventListener('copy', function () {
    mainFormMessage.classList.add('_copy');
    textareaNotice.insertAdjacentHTML(
        `beforeend`,
        `<div style = "color:#bcab28; margin-top: 2px">Copy</div>`
    );
    setTimeout(removeStyleMessage, 2500);
});

mainFormMessage.addEventListener('paste', function () {
    mainFormMessage.classList.add('_paste');
    textareaNotice.insertAdjacentHTML(
        `beforeend`,
        `<div style = "color:#9864c9; margin-top: 2px">Paste</div>`
    );
    setTimeout(removeStyleMessage, 2500);
});

mainFormMessage.addEventListener('cut', function () {
    mainFormMessage.classList.add('_cut');
    textareaNotice.insertAdjacentHTML(
        `beforeend`,
        `<div style = "color:#73bbdb; margin-top: 2px">Cut</div>`
    );
    setTimeout(removeStyleMessage, 2500);
});

function removeStyleMessage() {
    mainFormMessage.classList.remove('_copy');
    mainFormMessage.classList.remove('_paste');
    mainFormMessage.classList.remove('_cut');
    textareaNotice.lastElementChild.remove();
}

//Функции focus и blur
function focusElementForm(item) {
    item.placeholder = '';
}

function blurElementForm(item, placeholder) {
    item.placeholder = placeholder;
}

//Radio
const mainFormRadio = mainForm.radio;

mainFormRadio[0].parentElement.addEventListener('change', function (e) {
    if (e.target.closest('input[type=radio]')) {
        setTimeout(() => {
            mainFormRadio[2].checked = true;
        }, 700);
    }
});

//Checkbox
const mainFormCheckbox = mainForm.querySelectorAll('.main-form__item input[type=checkbox]');
const specialText = 'Green';
let labelValues = {};

mainFormCheckbox.forEach(element => {
    labelValues[element.id] = element.nextElementSibling.innerHTML;
});

mainFormCheckbox[0].parentElement.addEventListener('change', function (e) {
    if (e.target.closest('input[type=checkbox]')) {
        if (e.target.checked) {
            e.target.nextElementSibling.innerHTML = specialText;
        }

        mainFormCheckbox.forEach(element => {
            if (!element.checked) {
                element.nextElementSibling.innerHTML = labelValues[element.id];
            }
        });
    }
});

//Select
const mainFormSelect = mainForm.select;
const mainFormSelectOptions = mainForm.querySelectorAll('.main-form__select option');
let optionValues = {};

mainFormSelectOptions.forEach(element => {
    optionValues[element.value] = element.text;
});

mainFormSelect.addEventListener('change', function () {
    let mainFormSelectedIndex = mainFormSelect.selectedIndex;

    if (mainFormSelect.options[mainFormSelectedIndex].selected) {
        mainFormSelect.options[mainFormSelectedIndex].text = specialText;
    }

    mainFormSelectOptions.forEach(element => {
        if (!element.selected) {
            element.text = optionValues[element.value];
        }
    });
});

//File
const mainFormFile = mainForm.file;
const mainFormFileLabel = document.querySelector('.main-form__file');
const valueFile = mainFormFileLabel.lastElementChild.innerHTML;
const specialName = 'green_image';

mainFormFile.addEventListener('change', addImage);

function addImage() {
    if (mainFormFile.value) {
        if (mainFormFile.files[0].name.length < 10) {
            mainFormFileLabel.lastElementChild.innerHTML = mainFormFile.files[0].name;
        } else {
            let fromIndex = mainFormFile.files[0].name.indexOf('.');
            let typeImage = mainFormFile.files[0].name.substring(fromIndex);

            mainFormFileLabel.lastElementChild.innerHTML = specialName + typeImage;
        }

        let fileUrl = URL.createObjectURL(mainFormFile.files[0]);

        if (!document.querySelector('.main-form__image')) {
            mainFormFileLabel.parentElement.insertAdjacentHTML(
                `beforeend`,
                `<div class = "main-form__image">
                    <img alt="" title="${mainFormFile.files[0].name}" src="${fileUrl}">
                </div>`
            );
        } else {
            mainFormFileLabel.nextElementSibling.remove();
            mainFormFileLabel.parentElement.insertAdjacentHTML(
                `beforeend`,
                `<div class = "main-form__image">
                    <img alt="" title="${mainFormFile.files[0].name}" src="${fileUrl}">
                </div>`
            );
        }
    } else {
        mainFormFileLabel.lastElementChild.innerHTML = valueFile;
        mainFormFileLabel.nextElementSibling.remove();
    }
}

//Изображение
const animationImage = document.querySelector('.content__image');

animationImage.addEventListener('mousemove', function (e) {
    moveAnimationImage(e.currentTarget, e.offsetX, e.offsetY);
});

animationImage.addEventListener('mouseleave', function (e) {
    if (e.target.closest('.content__image')) delAnimationImage(e.target.closest('.content__image'));
});

//Отправка формы
mainForm.addEventListener('submit', function (e) {
    checkingCorrectnessForm(e);
});

function checkingCorrectnessForm(e) {
    const emailValue = mainFormEmail.value;
    let radioChecked = false;
    let checkboxChecked = false;
    let optionsSelected = false;

    mainFormRadio.forEach(element => {
        if (element.checked) {
            radioChecked = true;
        }
    });

    mainFormCheckbox.forEach(element => {
        if (element.checked) {
            checkboxChecked = true;
        }
    });

    mainFormSelectOptions.forEach(element => {
        if (element.selected) {
            console.log(element.value);
            optionsSelected = true;
        }
    });

    if (!mainFormEmail.value || !mainFormPassword.value || !mainFormMessage.value || !mainFormFile.value
        || !radioChecked || !checkboxChecked) {
        alert("Форма не заполнена");
        e.preventDefault();
    } else if (!emailValue.endsWith(emailDomain)) {
        alert("Неверно введён Email");
        e.preventDefault();
    } else if (mainFormPassword.value.toLowerCase() !== 'green') {
        alert("Неверно введено Green Name");
        e.preventDefault();
    } else if (mainFormSelect.options[mainFormSelect.selectedIndex].text !== specialText) {
        alert("Не выбран Greenlect");
        e.preventDefault();
    }
}
