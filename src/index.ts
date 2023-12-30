import axios from "axios";
import cheerio from "cheerio";
import { createObjectCsvWriter } from "csv-writer"


const url = "URL_of_the_product_page";
const AxiosInstance = axios.create();
const csvWriter = createObjectCsvWriter({
    path: "./output.csv",
    header: [
        {id: "name", title: "Name"},
        {id: "price", title: "Price"},
        {id: "description", title: "Description"}
    ]
})

interface productData {
  name: string;
  price: string;
  description: string;
}

AxiosInstance.get(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const rankingsTableRows = $(".rankingTable > tbody > tr");
    const rankings: productData[] = [];

    rankingsTableRows.each((i, elem) => {
      const name: string = $(elem).find(".product-name").text().trim();
      const price: string = $(elem).find(".product-price").text().trim();
      const description: string = $(elem).find(".product-description").text().trim();
      rankings.push({ name, price, description });
    });
    csvWriter.writeRecords(rankings).then(() => console.log("Written to file"))
  })
  .catch(console.error);
