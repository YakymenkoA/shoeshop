import React, { useState, useEffect } from "react";
import { ReviewService } from "../../../services/reviewService";
import { RatingStars } from "../RatingStars";
import { Link } from 'react-router-dom';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const reviewsPerPage = 5;
  const serverPageSize = 20;
  const [fetchedPages, setFetchedPages] = useState(1);

  useEffect(() => {
    const loadReviews = async () => {
        try {
          const response = await ReviewService.getAll(fetchedPages, serverPageSize);
          const newItems = response.data.items;
          setReviews(prev => [...prev, ...newItems]);
          if (newItems.length < serverPageSize) setHasMore(false);
        } catch (error) {
          console.error(error);
        }
    };
    loadReviews();
  }, [fetchedPages]);

  const handleDeleteReview = async (id) => {
    try {
      await ReviewService.delete(id);
      setReviews(prev => prev.filter(review => review.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const visiblePages = Math.ceil((fetchedPages * serverPageSize) / reviewsPerPage);

  const handleLoadMore = () => {
    setFetchedPages(prev => prev + 1);
  };

  return (
    <div>
      <ul className="list-group mb-4">
        {currentReviews.map((review) => (
          <li key={review.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{review.userName}</strong> rated <strong><Link to={`/productdetails/${review.productId}`} className="text-dark black-underline" style={{ cursor: "pointer" }}>{review.productName}</Link></strong>
                <RatingStars rating={review.rating} />
                <p className="mb-1">{review.comment}</p>
                <small>{new Date(review.createDate).toLocaleString()}</small>
              </div>
              <button
                className="btn btn-outline-dark"
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {visiblePages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: visiblePages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="btn btn-dark page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {hasMore && (
        <div className="text-center mt-3">
          <button className="btn btn-dark" onClick={handleLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
