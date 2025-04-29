import React, { useState, useEffect } from "react"
import { ReviewService } from "../../services/reviewService"
import { RatingStars } from "./RatingStars"
import { RatingStarsEdit } from "./RatingStarsEdit"
import EditReview from "./EditReview"
import Cookies from 'js-cookie'
 
const Review = ({ productId }) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const API_URL = process.env.REACT_APP_FILES_FOLDER
  const currentUserId = Cookies.get('id')

  const onEdit = (id, newComment, newRating) => {
    setComments((prev) =>
      prev.map((item) =>
        item.id === id 
          ? { ...item, comment: newComment, rating: newRating } 
          : item
      )
    )
    setEditingId(null)
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await ReviewService.delete(id);
        onDelete(id);
      } catch (error) {
        console.error("Error deleting review:", error)
      }
    }
  }

  const onDelete = (id) => {
    setComments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSend = async () => {
    try {
      const response = await ReviewService.create({
        productId,
        rating,
        comment,
      });

      
      const newReview = response.data.review;
      console.log(newReview);

      setComments((prev) => [newReview, ...prev ]);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const response = await ReviewService.getByProductId(productId);
        setComments(response.data.items || response.data);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container my-5 py-5">
      <div className="row d-flex justify-content-center">
        <div className="col-md-12 col-lg-10">
          <div className="card text-body">
            <div className="card-body p-4">
              <h4 className="mb-0">Comments</h4>
              <p className="fw-light mb-4 pb-2">
                Thank you for your comment - your opinion is important to us!
              </p>
              
              <div
                className="mb-4 p-3"
                style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
              >
                <h5>Send review</h5>
                <div className="mb-2">
                  <RatingStarsEdit rating={rating} onChange={setRating}  />
                </div>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave a comment..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={handleSend}
                  className="btn btn-success mt-2"
                >
                  Send
                </button>
              </div>
              
              {comments.map((item, index) => (
                <div key={index} style={{marginTop: '20px'}}>
                  <div className="d-flex flex-start">
                    <img
                      className="rounded-circle shadow-1-strong me-3"
                      src={`${API_URL}/${item.photo}`}
                      alt="avatar"
                      width="60"
                      height="60"
                    />
                    <div>
                      <h6 className="fw-bold mb-1">
                        {item.userName}
                        <span style={{fontWeight: '400'}}>|{new Date(item.createDate).toLocaleDateString()}|</span>
                        {item.userId === currentUserId && (
                          <>
                            <i 
                              className="bi bi-pencil" 
                              onClick={() => setEditingId(item.id)}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                            <i 
                              className="bi bi-trash" 
                              onClick={() => handleDelete(item.id)}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                            {
                              editingId === item.id ? (
                                <>
                                <EditReview
                                  reviewId={item.id}
                                  initialRating={item.rating}
                                  initialComment={item.comment}
                                  onUpdate={onEdit}
                                />
                                <button
                                  className="btn btn-sm btn-secondary mt-2 mb-2"
                                  style={{width: '70px'}}
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </button>
                                </>
                                ) : (<></>)
                            }
                          </>
                        )}
                      </h6>
                      {
                        editingId !== item.id ? (
                          <>
                            <div className="d-flex align-items-center">
                            <RatingStars rating={item.rating} />
                            </div>
                            <p className="mb-2">{item.comment}</p>
                          </>
                        ) : (<></>)
                      }
                    </div>
                  </div>
                  {index < comments.length - 1 && <hr className="my-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
