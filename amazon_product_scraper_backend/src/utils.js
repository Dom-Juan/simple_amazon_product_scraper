const fs = require("fs");

const generateTitle = (product, link) => {
    const title = product.find(".a-size-medium.a-color-base.a-text-normal").text();
    if(title === "") {
        const urlSegment = link;
        if(typeof urlSegment === "string") { // regex magic below.
            const urlSegmentStripped = urlSegment.split("/")[1];
            const title = urlSegmentStripped.replace(/-/g, " ");
            return title;
        }
    }
    return title;
}

// Generate a filename based on the date the request was made.
const generateFilename = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day}-${hour}-${minutes}-${seconds}.json`;
}

// create the file and save it.
const saveProductJson = (products) => {
    const filename = generateFilename();
    const jsonProducts = JSON.stringify(products, null, 2);
    const folder = process.env.NODE_ENV === "test" ? "test-data" : "data"; // ternary op. to check if the current instance is a test.
    if(!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    fs.writeFileSync(`${folder}/${filename}`, jsonProducts);
    return `./data/${filename}`;
}

// exporting our functions to be used by our scraper.js
module.exports = {generateFilename, saveProductJson, generateTitle}