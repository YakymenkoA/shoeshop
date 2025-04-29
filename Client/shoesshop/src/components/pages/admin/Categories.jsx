import React, { useState, useEffect } from "react";
import { CategoryService } from "../../../services/categoryService";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedCategory, setEditedCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const loadCategories = async () => {
        try {
            const response = await CategoryService.getAll()
            setCategories(response.data)
            console.log(response.data)
        } catch (error) {
            console.error(error)
        }
    }
        
    useEffect(() => {
        loadCategories()
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const response = await CategoryService.create({categoryName: newCategory})
        setCategories(prev => [...prev, response.data]);
        setNewCategory("");
    }

    const handleDeleteCategory = async (id) => {
        try {
            await CategoryService.delete(id)
            setCategories(prev => prev.filter(category => category.id !== id))
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditClick = (category) => {
        setEditingId(category.id);
        setEditedCategory(category.categoryName);
    };

    const handleSaveClick = () => {
        CategoryService.update(editingId, {categoryName: editedCategory})
        setCategories(prev => prev.map(c => c.id === editingId ? { ...c, categoryName: editedCategory } : c));
        setEditingId(null);
    };

    return (
        <div>

            <form onSubmit={handleAddCategory} className="mb-3 d-flex">
                <input
                type="text"
                className="form-control me-2"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                />
                <button type="submit" className="btn btn-dark">Add</button>
            </form>

            <ul className="list-group">
                {categories.map((category) => (
                <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {editingId === category.id ? (
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-50"
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                    />
                    ) : (
                    <span>{category.categoryName}</span>
                    )}
                    <div>
                    {editingId === category.id ? (
                        <>
                        <button className="btn btn-dark me-2" onClick={handleSaveClick}>Save</button>
                        <button className="btn btn-outline-dark" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                        <button className="btn btn-dark me-2" onClick={() => handleEditClick(category)}>Edit</button>
                        <button className="btn btn-outline-dark" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                        </>
                    )}
                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
