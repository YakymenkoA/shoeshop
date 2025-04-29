namespace ShoesShop.Service
{
    public class FileManager
    {
        public static readonly List<string> imageExtensions = [".JPG", ".JPEG", ".PNG", ".GIF"];

        public static async Task<string> SaveFileAsync(IFormFile file, string contentRootPath, string folderWayPoint)
        {
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(contentRootPath, folderWayPoint, fileName);

            using (var fs = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            return fileName;
        }

        public static void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        public static bool IsFileAllowed(string fileExtension)
        {
            return imageExtensions.Contains(fileExtension.ToUpper());
        }

    }
}
