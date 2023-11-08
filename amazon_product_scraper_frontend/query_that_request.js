let localProducts = [];                     // array of objects used to populate inner html after the fetch.
const baseURL = 'https://www.amazon.com';   // base url so that the links work properly to the amazon website.

$(document).ready(function () { // jquery waiting page to load before executing any scrips.
    $("#createRequest").click(function (event) { // when user clicks the scrap! button, start the fetch.
        event.preventDefault(); // avoid reloading the page.
        console.log("Sending the request. . .");
        let keyword = document.getElementById('keyword').value; // checking if the keywords is working.
        const url = "http://localhost:3000/scrape?keyword=" + keyword; // fetch url is the API host and route + the keywords.
        console.log("keyword:", keyword, "\n", "Search URL:", url);
        $.ajax({    // AJAX starts working on the fetch.
            url: url,       // URL for the fetch.
            type: 'get',    // as required, it is a GET.
            xhrFields: {    // I was getting CORS errors while doing this so i did all i could to make this work.
                withCredentials: false
            },
            crossDomain: true,
            async: true,
            dataType: 'json',
            headers: {
                "accept": "application/json",
                "content-type": "application/xml",
            },
            contentType: 'application/x-www-form-urlencoded',
            success: function (data, status) {  // if the fetch is a success, the function should get the data and put it in the list.
                alert("Sucess on fetching data!");
                localProducts = data.products;
                //console.log(localProducts);
            },
            error: function (status) {  // If the fetch fails we warn the user.
                alert("ERROR on fetching data!\n", status);
                localProducts = data.products;
                //console.log(localProducts);
            },
        });
    });

    $("#showProducts").click((event) => {   // event to show the fetched data to the frontend
        // - localProducts[i].imageLink has the scraped image link.
        // - localProducts[i].title has the title of the product.
        // - localProducts[i].stars has the total of stars of the product.
        // - localProducts[i].numberOfReviews has the total of reviews of the product.
        // - localProducts[i].price has the price of the product.
        // - localProducts[i].link has the body link of the product wich is added to baseURL.
        let i = 0;
        while(i < localProducts.length) { // while iterator is lesser than the ammount of products objects in the array we do:
            $(`#${0}`).append(  // appedn a div card with the objects contents and append it to the HTML.
                `
                <div class="card" style="max-width: 18rem; height: 45rem;">
                    <img src="${localProducts[i].imageLink}" style="max-height: 13rem;" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${localProducts[i].title}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">⭐ ${localProducts[i].stars}</li>
                        <li class="list-group-item">📖 ${localProducts[i].numberOfReviews}</li>
                        <li class="list-group-item"> U$ ${localProducts[i].price}</li>
                    </ul>
                    <a href="${baseURL}${localProducts[i].link}" class="btn btn-primary">Go to Product Page</a>
                </div>
                `
                );
                i++;
        }
    });
});
