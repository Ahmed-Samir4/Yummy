/// <reference path="../typings/globals/jquery/index.d.ts" />
const rowData = document.getElementById('rowData');

function ShowInnerLoading() {
    $('.inner-loading-screen').fadeIn(300);
}
function HideInnerLoading() {
    $('.inner-loading-screen').fadeOut(300);
}
function N(length) {
    if (length < 20) {
        return length;
    } else {
        return 20;
    }
}
function openNav() {
    $('.sideNavbar').animate({ left: 0 }, 500);
    $('.navContent ul li').each(function (index) {
        $(this).delay(index * 100).animate({ top: 0 }, 500);
    });
    $('.fa-align-justify').toggleClass('fa-x fa-align-justify');
}
function closeNav() {
    $('.sideNavbar').animate({ left: '-256.562px' }, 500);
    $('.navContent ul li').animate({ top: 300 }, 500);
    $('.fa-x').toggleClass('fa-x fa-align-justify');
}
//sidebar
$('.open-close-icon').click(function () {
    if ($('.open-close-icon').hasClass('fa-align-justify')) {
        openNav();
    } else {
        closeNav();
    }
})





//displayMeals
function displayMeals(Data, n) {
    let temp = '';
    for (let i = 0; i < n; i++) {
        temp += `<div class="col-md-3">
        <div onclick="MealDetails(${Data[i].idMeal
            })" class="meal">
            <img class="w-100" src="${Data[i].strMealThumb}"
                alt="" srcset="">
            <div class="meal-layer">
                <h3>${Data[i].strMeal}</h3>
            </div>
        </div>
    </div>`
    }
    rowData.innerHTML = temp;
}
async function MealDetails(id) {
    ShowInnerLoading();
    closeNav();
    $('.search').addClass('d-none');
    $('html').css('overflow-y ', 'hidden');
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const temp = await resp.json();

    let mealData = temp.meals[0];

    //get recipes li
    let recipes = '';
    let i = 1;
    while (mealData[`strIngredient${i}`]) {
        recipes += `<li class="alert alert-info m-2 p-1">${mealData[`strMeasure${i}`]} ${mealData[`strIngredient${i}`]}</li>`
        i++;
    }

    //get tags li
    let tagInfo = '';
    if (mealData.strTags != null) {
        let temp2 = mealData.strTags;
        let tags = temp2.split(",");
        for (let i = 0; i < tags.length; i++) {
            tagInfo += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
        }
    } else {
        tagInfo = '';
    }

    rowData.innerHTML = `<div class="col-md-4">
    <img class="w-100 rounded-3" src="${mealData.strMealThumb}"
        alt="">
    <h2>${mealData.strMeal}</h2>
</div>
<div class="col-md-8">
    <h2>Instructions</h2>
    <p>${mealData.strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${mealData.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${mealData.strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${recipes}
    </ul>

    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
    ${tagInfo}
    </ul>

    <a target="_blank" href="${mealData.strSource}"
        class="btn btn-success">Source</a>
    <a target="_blank" href="${mealData.strYoutube}"
        class="btn btn-danger">Youtube</a>
</div>`
    HideInnerLoading();
}

//----------Categories---------------
async function getCategories() {
    ShowInnerLoading();
    closeNav()
    $('.search').addClass('d-none');
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    const CategoriesData = await resp.json();
    displayCategories(CategoriesData.categories);
    HideInnerLoading();
}
function displayCategories(data) {
    let temp = '';
    for (let i = 0; i < data.length; i++) {
        temp += `<div class="col-md-3">
        <div onclick="getCategoryMeals('${data[i].strCategory}')" class="meal">
            <img class="w-100" src="${data[i].strCategoryThumb}" alt="" srcset="">
            <div class="meal-layer d-block text-center">
                <h3>${data[i].strCategory}</h3>
                <p>${data[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
        </div>`
    }
    rowData.innerHTML = temp;
}
async function getCategoryMeals(Category) {
    ShowInnerLoading();
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category}`);
    const CategoryData = await resp.json();
    displayMeals(CategoryData.meals, N(CategoryData.meals.length));
    HideInnerLoading();
}

//----------Areas---------------
async function getAreas() {
    ShowInnerLoading();
    closeNav()
    $('.search').addClass('d-none');
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    const AreaData = await resp.json();
    displayArea(AreaData.meals);
    HideInnerLoading();
}
function displayArea(data) {
    let temp = '';
    for (let i = 0; i < data.length; i++) {
        temp += `<div class="col-md-3">
        <div onclick="getAreaMeals('${data[i].strArea}')" class="simple">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${data[i].strArea}</h3>
        </div>
    </div>`
    }
    rowData.innerHTML = temp;
}
async function getAreaMeals(Area) {
    ShowInnerLoading();
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`);
    const AreaData = await resp.json();
    displayMeals(AreaData.meals, N(AreaData.meals.length));
    HideInnerLoading();
}

//----------Ingredients---------------
async function getIngredients() {
    ShowInnerLoading();
    closeNav()
    $('.search').addClass('d-none');
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    const IngredientsData = await resp.json();
    displayIngredients(IngredientsData.meals);
    HideInnerLoading();
}
function displayIngredients(data) {
    let temp = '';
    for (let i = 0; i < 20; i++) {
        temp += `<div class="col-md-3">
        <div onclick="getIngredientsMeals('${data[i].strIngredient}')" class="simple">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${data[i].strIngredient}</h3>
            <p>${data[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
    </div>`
    }
    rowData.innerHTML = temp;
}
async function getIngredientsMeals(Ingredient) {
    ShowInnerLoading();
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`);
    const IngredientData = await resp.json();
    displayMeals(IngredientData.meals, N(IngredientData.meals.length));
    HideInnerLoading();
}

//----------Search---------------
function getSearch() {
    closeNav()
    $('.search').removeClass('d-none');
    rowData.innerHTML = '';
    $('input').val('');
}
async function searchName(name) {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const nameInfo = await resp.json();
    // console.log(nameInfo.meals);
    if (nameInfo.meals == null) {
        rowData.innerHTML = '';
    } else {
        displayMeals(nameInfo.meals, nameInfo.meals.length);
    }

}
async function searchLetter(letter) {
    ShowInnerLoading();
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const letterInfo = await resp.json();
    // console.log(letterInfo.meals);
    if (letterInfo.meals == null) {
        rowData.innerHTML = '';
    } else {
        displayMeals(letterInfo.meals, letterInfo.meals.length);
    }
    HideInnerLoading();
}

//----------Contact---------------
function getContact() {
    closeNav()
    $('.search').addClass('d-none');
    rowData.innerHTML = `<div class="contact">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input onkeyup="nameValidation()" type="text" class="nameInput form-control"
                    placeholder="Enter Your Name">
                <div class="nameAlert alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="emailValidation()" type="email" class="emailInput form-control "
                    placeholder="Enter Your Email" >
                <div class="emailAlert alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="phoneValidation()" type="text" class="phoneInput form-control "
                    placeholder="Enter Your Phone" >
                <div class="phoneAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="ageValidation()" type="number" class="ageInput form-control "
                    placeholder="Enter Your Age" >
                <div class="ageAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="passValidation()" type="password"
                    class="passwordInput form-control " placeholder="Enter Your Password" >
                <div class="passwordAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input onkeyup="repassValidation()" type="password"
                    class="repasswordInput form-control " placeholder="Repassword">
                <div class="repasswordAlert alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword
                </div>
            </div>
        </div>
        <button disabled="" class="submitBtn btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
    </div>`;
    $('.nameInput').val('');
    $('.emailInput').val('');
    $('.phoneInput').val('');
    $('.ageInput').val('');
    $('.passwordInput').val('');
    $('.repasswordInput').val('');
}
const nameR = /^[a-zA-Z ]+$/;
const emailR = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneR = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const ageR = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
const passwordR = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
let flag1 = false, flag2 = false, flag3 = false, flag4 = false, flag5 = false, flag6 = false;

function nameValidation() {
    if (nameR.test($('.nameInput').val())) {
        flag1 = true;
        $('.nameAlert').addClass('d-none');
    } else {
        $('.nameAlert').removeClass('d-none');
        flag1 = false;
    }
    contactValidation()
}
function emailValidation() {
    if (emailR.test($('.emailInput').val())) {
        flag2 = true;
        $('.emailAlert').addClass('d-none');
    } else {
        $('.emailAlert').removeClass('d-none');
        flag2 = false;
    }
    contactValidation()
}
function phoneValidation() {
    if (phoneR.test($('.phoneInput').val())) {
        flag3 = true;
        $('.phoneAlert').addClass('d-none');
    } else {
        $('.phoneAlert').removeClass('d-none');
        flag3 = false;
    }
    contactValidation()
}
function ageValidation() {
    if (ageR.test($('.ageInput').val())) {
        flag4 = true;
        $('.ageAlert').addClass('d-none');
    } else {
        $('.ageAlert').removeClass('d-none');
        flag4 = false;
    }
    contactValidation()
}
function passValidation() {
    if (passwordR.test($('.passwordInput').val())) {
        flag5 = true;
        $('.passwordAlert').addClass('d-none');
    } else {
        $('.passwordAlert').removeClass('d-none');
        flag5 = false;
    }
    contactValidation()
}
function repassValidation() {
    if ($('.repasswordInput').val() == $('.passwordInput').val()) {
        flag6 = true;
        $('.repasswordAlert').addClass('d-none');
    } else {
        $('.repasswordAlert').removeClass('d-none');
        flag6 = false;
    }
    contactValidation()
}
function contactValidation() {

    if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6) {
        $('.submitBtn').removeAttr('disabled');
    } else {
        $('.submitBtn').attr('disabled', '');
    }

}


//initialPage
async function initialPage() {
    searchName('');
    $(".loading-screen").delay(500).fadeOut(500);
    $('.sideNavbar').animate({ left: '-256.562px' }, 750);


}
$(document).ready(function () {
    initialPage()
})
