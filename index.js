const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObj= JSON.parse(data);
    
const slugs = dataObj.map(el=>slugify(el.productName ,{lower:true}))
console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);


    //Overview
    if(pathname==='/'||pathname==='/overview'){

        const cardHtml = dataObj.map(el=>replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);

        res.writeHead(404, {'content-type':'text/html'})
        res.end(output);
    }

    //Product
    else if(pathname==='/product'){

        res.writeHead(200, {'content-type':'text/html'})
        const product = dataObj[query.id];
        // const slug=slugify(product,{lower:true});
        // console.log(slug);
        const output = replaceTemplate(tempProduct, product);
        res.end(output);}


    //Api
    else if(pathname==='/api'){
        res.writeHead(200, {'content-type':'application/json'})
        res.end(data);

    //Not found
    }else{
        res.writeHead(404, {'content-type':'text/html'})
        res.end('<h1>page not found</h1>');
    }
})

server.listen(8000,()=>{
    console.log("Listening to request on port 8000");
});