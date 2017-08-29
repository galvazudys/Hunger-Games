let app = document.getElementById('app');
let caloriesOutput = document.getElementById('output');
let ulNode = document.createElement('ul');
let totalCaloriesOutput = document.getElementById('totalCalories');
let newListOfProducts = [];
let totalCal = 0;
let data;

ulNode.setAttribute('class', 'collection');
app.appendChild(ulNode);

//using event listiner onchange placed directly on input tag and passing value
//this function handle event.
function fetchData(val) {
    ulNode.innerHTML = `<div class="progress">
                          <div class="indeterminate"></div>
                        </div>`;

    //using AJAX request to api server,that gives as a promise
    axios({
        method: 'get',
        url: `https://nutritionix-api.p.mashape.com/v1_1/search/${val}?fields=nf_calories,item_name,brand_name`,
        headers: {
            'X-Mashape-Key':
                'LOkyvYzwXFmshynyglg0VkGgbg8np1gtcWyjsnDDvOGdcGCvhu'
        }
    }).then(function(response) {
        //handle promise callback

        ulNode.innerHTML = '';
        data = response.data.hits;
        if (data.length === 0) {
            ulNode.innerHTML = `<div class="card-panel red lighten-3">No Match Found!</div>`;
        }
        data.forEach(item => {
            ulNode.innerHTML += `<li id=${item._id} class="collection-item animated zoomInDown ">
        ${item.fields.item_name}(${item.fields.brand_name})
        <br>
          <span class="right">
            ${item.fields.nf_calories}
          </span>
        </li>`;
        });
    });
}

//event listener for handling adding object to new list of products
ulNode.addEventListener('click', function(e) {
    caloriesOutput.innerHTML = '';
    data.forEach(item => {
        if (item._id === e.target.id) {
            newListOfProducts.push({
                name: item.fields.item_name,
                calories: item.fields.nf_calories
            });
            renderList(newListOfProducts);
        }
    });
});

//event Listener for handling removing object from new product list
caloriesOutput.addEventListener('click', function(e) {
    if (e.target.tagName === 'I') {
        caloriesOutput.innerHTML = '';
        let targetId = parseInt(e.target.parentNode.parentNode.id);
        newListOfProducts.splice(targetId, 1);
        renderList(newListOfProducts);
    }
});

//render List of New products
function renderList(value) {
    totalCal = 0;
    value.forEach((item, index) => {
        totalCal += item.calories;
        caloriesOutput.innerHTML += `<li id=${index} class="collection-item"><span><i class="fa fa-times"></i></span> ${item.name}<span class="right calories-out">${item.calories}</span></li>`;
        totalCaloriesOutput.innerHTML = `<hr><h4><em>Total Calories: </em> ${parseInt(
            totalCal
        )}</h4>`;
    });
}
