import React, { useState } from "react";
import { ReviewService } from "../../services/reviewService";
import { RatingStarsEdit } from "./RatingStarsEdit";

export default function EditReview({ reviewId, initialRating, initialComment, onUpdate }) {
  const [newRating, setNewRating] = useState(initialRating);
  const [newComment, setNewComment] = useState(initialComment);

  const handleSave = async () => {
    try {
      await ReviewService.update(reviewId, {
        rating: newRating,
        comment: newComment,
      });
      onUpdate(reviewId, newComment, newRating);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div className="edit-form">
      <RatingStarsEdit rating={newRating} onChange={setNewRating} />
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="form-control mt-2"
      />
      <div className="mt-2">
        <button className="btn btn-sm btn-success me-2" style={{width: '70px'}} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}
