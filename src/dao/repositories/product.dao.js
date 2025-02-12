import { productosModel} from "../models/product.model.js";

export class ProductDao {
    async getAll (limit, page, sort){
        const paginate = {
            limit:  parseInt(limit) || 10,
            page: parseInt(page) || 1
          }
      
          if (sort && (sort === "asc" || sort === "desc")) paginate.sort = {price: sort};
      
          const result = await productosModel.paginate({}, paginate);
      
          result.prevLink = result.hasPrevPage?`http://localhost:8080?page=${result.prevPage}` : null;
          result.prevLink = result.hasNextPage?`http://localhost:8080?page=${result.nextPage}` : null;
      
          if(result.prevLink && paginate.limit !== 10) result.prevlink += `&limit=${paginate.limit}`;
          if(result.nextLink && paginate.limit !== 10) result.nextlink += `&limit=${paginate.limit}`;
      
          if(result.prevLink && paginate.sort) result.prevlink += `&sort=${paginate.sort}`;
          if(result.nextLink && paginate.sort) result.nextlink += `&sort=${paginate.sort}`;
          
          const products = {
            status: result ? "success" : "error",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink
          };

            return products;
    }

    async getById(id){
        return await productosModel.findById(id);

    }

    async create(product){
        return await productosModel.create(product);
    }

    async update(id, product){
        return await productosModel.findByIdAndUpdate(id, product, {new: true});
    }

    async delete(id){
        return await productosModel.findByIdAndDelete(id);
    }
}