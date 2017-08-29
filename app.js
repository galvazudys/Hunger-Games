let app = document.getElementById('app');
let calOutput = document.getElementById('output');
let ulNode = document.createElement('ul');
let totalOutput = document.getElementById('totalCalories');
let newData = [];
let totalCal = 0;
let data;

ulNode.setAttribute('class', 'collection');
app.appendChild(ulNode);

function fetchData(val) {
    ulNode.innerHTML = `<div class="progress">
                          <div class="indeterminate"></div>
                        </div>`;
    axios({
        method: 'get',
        url: `https://nutritionix-api.p.mashape.com/v1_1/search/${val}?fields=nf_calories,item_name,brand_name`,
        headers: {
            'X-Mashape-Key':
                'LOkyvYzwXFmshynyglg0VkGgbg8np1gtcWyjsnDDvOGdcGCvhu'
        }
    }).then(function(response) {
        ulNode.innerHTML = '';
        data = response.data.hits;
        console.log(data);
        data.forEach(item => {
            ulNode.innerHTML += `<li id=${item._id} class="collection-item">
        ${item.fields.item_name}
        <br>
          <span class="right">
            ${item.fields.nf_calories}
          </span>
        </li>`;
        });
    });
}

ulNode.addEventListener('click', function(e) {
    calOutput.innerHTML = '';
    data.forEach(item => {
        if (item._id === e.target.id) {
            newData.push({
                name: item.fields.item_name,
                calories: item.fields.nf_calories
            });
            totalListRender(newData);
        }
    });
});

calOutput.addEventListener('click', function(e) {
    if (e.target.tagName === 'I') {
        calOutput.innerHTML = '';
        let targetId = parseInt(e.target.parentNode.parentNode.id);
        newData.splice(targetId, 1);
        totalListRender(newData);
    }
});

function totalListRender(data) {
    data.forEach((item, index) => {
        totalCal += item.calories;
        calOutput.innerHTML += `<li id=${index} class="collection-item"><span><i class="fa fa-times"></i></span> ${item.name}<span class="right calories-out">${item.calories}</span></li>`;
        totalOutput.innerHTML = `<hr><h4><em>Total Calories: </em> ${parseInt(
            totalCal
        )}</h4>`;
    });
}
