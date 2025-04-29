import React, { useState, useEffect } from "react";
import { BrandService } from "../../../services/brandService";

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedBrand, setEditedBrand] = useState("");
    const [newBrand, setNewBrand] = useState("");

    const loadBrands = async () => {
        try {
            const response = await BrandService.getAll()
            setBrands(response.data)
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadBrands()
    }, []);

    const handleAddBrand = async (e) => {
        e.preventDefault();
        const response = await BrandService.create({brandName: newBrand})
        setBrands(prev => [...prev, response.data]);
        setNewBrand("");
    }

    const handleDeleteBrand = async (id) => {
        try {
            await BrandService.delete(id)
            setBrands(prev => prev.filter(brand => brand.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditClick = (brand) => {
        setEditingId(brand.id);
        setEditedBrand(brand.brandName);
    };

    const handleSaveClick = () => {
        BrandService.update(editingId, {brandName: editedBrand})
        setBrands(prev => prev.map(b => b.id === editingId ? { ...b, brandName: editedBrand } : b));
        setEditingId(null);
    };

    return (
        <div>

            <form onSubmit={handleAddBrand} className="mb-3 d-flex">
                <input
                type="text"
                className="form-control me-2"
                placeholder="New Brand"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                />
                <button type="submit" className="btn btn-dark">Add</button>
            </form>

            <ul className="list-group">
                {brands.map((brand) => (
                <li key={brand.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {editingId === brand.id ? (
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-50"
                        value={editedBrand}
                        onChange={(e) => setEditedBrand(e.target.value)}
                    />
                    ) : (
                    <span>{brand.brandName}</span>
                    )}
                    <div>
                    {editingId === brand.id ? (
                        <>
                        <button className="btn btn-dark me-2" onClick={handleSaveClick}>Save</button>
                        <button className="btn btn-outline-dark" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                        <button className="btn btn-dark me-2" onClick={() => handleEditClick(brand)}>Edit</button>
                        <button className="btn btn-outline-dark" onClick={() => handleDeleteBrand(brand.id)}>Delete</button>
                        </>
                    )}
                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default Brands;
