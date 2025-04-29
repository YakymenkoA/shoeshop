export const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
        <div className="mb-1">
            {[...Array(fullStars)].map((_, i) => (
                <i key={i} className="bi bi-star-fill text-warning"></i>
            ))}
            {hasHalfStar && <i className="bi bi-star-half text-warning"></i>}
            {[...Array(emptyStars)].map((_, i) => (
                <i key={i + fullStars + 1} className="bi bi-star text-warning"></i>
            ))}
            <span className="ms-2">{rating.toFixed(1)}</span> 
        </div>
    )
}
