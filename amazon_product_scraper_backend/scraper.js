// Import essential libraries 
const cheerio = require("cheerio");
const axios = require("axios");
const router = require("express").Router();
// utils bellow are used to generate a .json file, to test the fetch before the frontend was done with
//insomina.
const { generateFilename, saveProductJson, generateTitle } = require("./src/utils");

const baseURL = 'https://www.amazon.com';   // base URL used for the scrap.

// Route to scrap the page.
router.get('/scrape', (req, res) => {
    console.log("GET - KEYWORD:", req.query.keyword); // checking if they keyword was passed through
    const keyword = req.query.keyword;
    const url = baseURL + '/s?k=' + keyword; // generating the url search results page with the products.
    console.log("URL:", url);
    try {
        axios.get(url).then((response) => { // get request for the page.
            const $ = cheerio.load(response.data);  // getting page data.
            const products = []; // list for the objects containing the products.
            $(".s-result-item").each((iterator, item) => { // for each item in the search result page we create an object.
                const product = $(item); // get the item.
                const priceWhole = product.find(".a-price-whole").text();   // scrap the price.
                const priceFraction = product.find(".a-price-fraction").text(); // scrap the fraction.
                const price = priceWhole + priceFraction;   // create full price.
                const imageLink = product.find('img.s-image').attr('src');  // scrap the image link.
                const link = product.find(".a-link-normal.a-text-normal").attr("href"); // find the href in the <a> and scrap it.
                let stars = product.find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span').attr('aria-label'); // find the starts and scrap that too.
                let numberOfReviews = product.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small').children('span').last().attr('aria-label'); // find the reviews and scrap it.
				const title = generateTitle(product, link); // use a function and regex to return a proper title for our product.
				if(numberOfReviews === undefined || numberOfReviews < 0) // avoid undefined if the ammount is 0% reviews.
					numberOfReviews = 0;
				if(stars === undefined || stars < 0) // same for the stars.
					stars = 0;
                if(title !== "" &&
                    price !== "" &&
                    link !== "") { // avoid getting null products.
                        products.push({title, price, stars, numberOfReviews, link, imageLink}); // push product to list.
                }
            });
            saveProductJson(products); // save list to json.
            //console.log(products);
            res.json({  // callback response with the list and other info.
                products_saved: products.length,
                message: "Products scraped successfully",
                filename: generateFilename(),
                products: products,
            });
        });
    } catch(error) {
        res.statusCode(500).json({
            message: "Error scraping products",
            error: error.message,
        });
    }
});

// Exporting the router so it can be used in the server file.
module.exports = router;