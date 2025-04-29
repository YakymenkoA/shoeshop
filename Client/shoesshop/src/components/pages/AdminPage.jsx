import React, { useState, useEffect } from "react";
import Brands from "./admin/Brands";
import Categories from "./admin/Categories";
import Reviews from "./admin/Reviews";
import Products from "./admin/Products";
import { UserService } from "../../services/userService";

const menuItems = ["Brands", "Categories", "Reviews", "Products"];

const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("Brands");
  const [loading, setLoading] = useState(true);

  const checkRole = async () => {
      setLoading(true);
      try {
        const response = await UserService.isAdmin();
        if (response.data) {
          setLoading(false);
        } else {
          window.location.href = '/404';
        }
      } catch (error) {
        window.location.href = '/404';
      }
  };

  useEffect(() => {
    checkRole();
  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case "Brands":
        return <Brands />;
      case "Categories":
        return <Categories />;
      case "Reviews":
        return <Reviews />;
      case "Products":
        return <Products />;
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
          <div className="loader"></div>
        ) : (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
          <aside className="p-4 border-end bg-white" style={{ width: "250px" }}>
            <nav className="nav flex-column">
              {menuItems.map((item) => (
                <button
                  key={item}
                  className={`btn mb-2 ${selectedMenu === item ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setSelectedMenu(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>
          <main className="flex-grow-1 p-4">
            <h1 className="h3 mb-4">{selectedMenu}</h1>
            {renderContent()}
          </main>
        </div> 
      )}
    </>
  );
};

export default AdminPage;
