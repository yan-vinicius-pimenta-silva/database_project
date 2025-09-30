using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<Driver> Drivers => Set<Driver>();
}
