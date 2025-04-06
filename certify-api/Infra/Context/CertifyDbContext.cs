using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Context
{
    public class CertifyDbContext : DbContext
    {
        public CertifyDbContext(DbContextOptions<CertifyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        }

        private static void SetGlobalQueryFilter<T>(ModelBuilder modelBuilder) where T : AuditableEntity
        {
            modelBuilder.Entity<T>().HasQueryFilter(e => !e.DeletedDate.HasValue);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(AuditableEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var method = typeof(CertifyDbContext)
                        .GetMethod(nameof(SetGlobalQueryFilter), BindingFlags.NonPublic | BindingFlags.Static)?
                        .MakeGenericMethod(entityType.ClrType);

                    method?.Invoke(null, new object[] { modelBuilder });
                }
            }

            modelBuilder.Ignore<EntityBase>();
            modelBuilder.Ignore<AuditableEntity>();
        }

        public DbSet<UserProfile> UserProfile { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<Guest> Guest { get; set; }
		public DbSet<EventType> EventType { get; set; }
		public DbSet<EventTemplate> EventTemplate { get; set; }

	}
}
