using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using backend.Data;

namespace backend
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlite("Data Source=ecommerce.db");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
