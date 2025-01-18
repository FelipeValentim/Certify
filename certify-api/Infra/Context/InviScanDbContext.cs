using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Context
{
    public class CertifyDbContext : DbContext
    {
        public CertifyDbContext(DbContextOptions<CertifyDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Ignore<EntityBase>();
        }

        public DbSet<UserProfile> UserProfile { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<Guest> Guest { get; set; }
		public DbSet<EventType> EventType { get; set; }
		public DbSet<EventTemplate> EventTemplate { get; set; }

	}
}
