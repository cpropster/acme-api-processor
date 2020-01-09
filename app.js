const findProductsInRange = (products, filter) => {
  return products.filter((product) => {
    return (
      product.suggestedPrice >= filter.min &&
      product.suggestedPrice <= filter.max
    );
  });
};

const groupCompaniesByLetter = (companies) => {
  return companies.reduce((acc, company) => {
    let group = company.name[0];
    if (!acc[group]) {
      acc[group] = [company];
    } else {
      acc[group].push(company);
    }
    return acc;
  }, {});
};

const groupCompaniesByState = (companies) => {
  return companies.reduce((acc, company) => {
    let group = company.state;
    if (!acc[group]) {
      acc[group] = [company];
    } else {
      acc[group].push(company);
    }
    return acc;
  }, {});
};

//something wrong with the below
const processedOfferings = (companies, products, offerings) => {
  return offerings.map((offering) => {
    return products.map((product) => {
      if (offering.productId === product.id) {
        offering[product] = product;
      }
      return companies.map((company) => {
        if (offering.companyId === company.id) {
          offering[company] = company;
        }
        return offerings;
      });
    });
  });
};

const findCompaniesByOfferings = (companies, offerings, minimum) => {
  return companies.filter((company) => {
    return (
      offerings.filter((offering) => {
        return offering.companyId === company.id;
      }).length >= minimum
    );
  });
};

//too late need to finish this and the other 'processed' function
const processedProducts = (products, offerings) => {
  return products.map((product) => {
    return offerings.map((offering) => {
      if (product.id === offering.productId) {
        let priceSum = 0;
        priceSum += offering.price;
        product["offeringPriceAvg"] = priceSum;
      }
    });
  });
};

const loadData = async () => {
  const acmeURL = "https://acme-users-api-rev.herokuapp.com/";
  const productEP = "api/products";
  const companiesEP = "api/companies";
  const offeringsEP = "api/offerings";

  const productPromise = axios
    .get(`${acmeURL}${productEP}`)
    .then((response) => response.data);
  const companiesPromise = axios
    .get(`${acmeURL}${companiesEP}`)
    .then((response) => response.data);
  const offeringsPromise = axios
    .get(`${acmeURL}${offeringsEP}`)
    .then((response) => response.data);

  const [products, companies, offerings] = await Promise.all([
    productPromise,
    companiesPromise,
    offeringsPromise,
  ]);

  console.log(processedProducts(products, offerings));
  console.log(processedOfferings(companies, products, offerings));
  console.log(groupCompaniesByState(companies));
  console.log(groupCompaniesByLetter(companies));
  console.log(findProductsInRange(products, { min: 2, max: 5 }));
  console.log(findCompaniesByOfferings(companies, offerings, 3));
  console.log(products);
  console.log(offerings);
  console.log(companies);
};

loadData();
