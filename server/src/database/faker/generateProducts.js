import fs from 'fs'; 
import { faker } from '@faker-js/faker';

function generateProducts(num) {
  const products = [];

  for (let i = 1; i <= num; i++) {
    const product = {
      id: i,
      text: faker.commerce.productName(),
      isCompleted : faker.datatype.boolean(),
    };
    products.push(product);
  }

  return products;
}

const products = generateProducts(10);

fs.writeFile('../json/products.json', JSON.stringify(products, null, 2), (err) => {
  if (err) {
    console.error('Error writing to file', err);
  } else {
    console.log('File products.json has been created successfully.');
  }
});
