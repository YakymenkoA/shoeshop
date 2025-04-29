import React from "react";

export const RatingStarsEdit = ({ rating = 0, onChange }) => {
  const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;

  const handleClick = (selectedRating) => {
    if (onChange) {
      onChange(selectedRating);
    }
  };

  return (
    <div className="rating-stars">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={`edit-${starValue}`}
            type="button"
            className="btn btn-link p-1"
            onClick={() => handleClick(starValue)}
          >
            <i
              className={`bi ${
                starValue <= safeRating ? "bi-star-fill" : "bi-star"
              } text-warning`}
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
            />
          </button>
        );
      })}
    </div>
  );
};