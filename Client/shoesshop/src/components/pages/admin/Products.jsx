import React, { useEffect, useState } from "react";
import { CategoryService } from "../../../services/categoryService";
import { BrandService } from "../../../services/brandService";
import { ProductsService } from "../../../services/productsService";
import { Link } from 'react-router-dom';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newProductId, setNewProductId] = useState(null);
  const [formData, setFormData] = useState({
    ProductName: "",
    Price: "",
    Description: "",
    CategoryId: "",
    BrandId: "",
    Discount: "",
    Rating: "",
    PhotoFile: null
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const catRes = await CategoryService.getAll();
        const brandRes = await BrandService.getAll();
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, PhotoFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }
    const response = await ProductsService.create(submitData)
    setNewProductId(response.data.id);
  };

  return (
    <div className="container mt-4">
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input type="text" name="ProductName" className="form-control" value={formData.ProductName} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" step="0.01" name="Price" className="form-control" value={formData.Price} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="Description" className="form-control" value={formData.Description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select name="CategoryId" className="form-select" value={formData.CategoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Brand</label>
          <select name="BrandId" className="form-select" value={formData.BrandId} onChange={handleChange} required>
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.brandName}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Discount (%)</label>
          <input type="number" name="Discount" className="form-control" value={formData.Discount} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input type="number" step="0.1" name="Rating" className="form-control" value={formData.Rating} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Photo</label>
          <input type="file" name="PhotoFile" className="form-control" onChange={handleFileChange}/>
        </div>

        <button type="submit" className="btn btn-dark">Create Product</button>
      </form>

      {newProductId && (
        <div className="mt-4">
          <Link to={`/productdetails/${newProductId}`} className="btn btn-primary">
            View Created Product
          </Link>
        </div>
      )}

    </div>
  );
};

export default Products;
