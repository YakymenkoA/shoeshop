namespace ShoesShop.Service
{
    public class PaginatedList<T>
    {
        public List<T>? Items { get; set; }
        public int TotalCount { get; set; }
    }
}
