// const { json } = require("express");

class APIFeatures {
    constructor (query ,queryStr){     //it is connected to the getProducts function in productController.js
        this.query=query;
        this.queryStr=queryStr;          //it is queryStr keyword=luffy&price[gte]=100&price[lte]=1000
    }
    search() {
      let keyword =  this.queryStr.keyword ? {
        name :{                                //regex - regular expression
            $regex:this.queryStr.keyword,      //$regex: this.queryStr.keyword would create a regex pattern equivalent to /apple/
            $options : 'i'                      //this.queryStr.keyword contains 'apple', the resulting regex pattern would be /apple/i, and it would match documents with the 'name' field containing 'apple', 'Apple', 'aPpLe', etc., in any case.
        }
      }: {};

      this.query.find({...keyword})
      return this;        //The search method returns this at the end. This enables method chaining, which means you can call other methods of the APIFeatures class on the same instance in sequence.
    }

    filter() {
        // Make a copy of the original queryStr
        const queryStrCopy = { ...this.queryStr };
      
        // Remove fields from queryStrCopy
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);
      
        // Convert the modified queryStrCopy into a JSON string
        let queryStr = JSON.stringify(queryStrCopy);
      
        // Replace the specified operators with MongoDB operators
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
      
        // Parse the JSON string back into a JavaScript object
        const filterObject = JSON.parse(queryStr);
      
        // Apply the filter to the query
        this.query = this.query.find(filterObject);
      
        // Return the modified query object
        return this;
      }

    paginate(resPerPage){
        const currentPage =Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage-1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;