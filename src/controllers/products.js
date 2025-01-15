import { productosModel } from "../models/productsModel.js";

export const getProducts = async (req, res) => {
  let { limit, page, sort } = req.query;
  try {
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
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsById = async (req,res) =>{
  const {id} = req.params;
  try {
    const product = await productosModel.findById(id);
    if(!product) return res.status(404).json({message: 'Product not found'});

    return res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
}

export const createProduct = async (req, res) => {
  try {
    const product = await productosModel.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productosModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productosModel.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
