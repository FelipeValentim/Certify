using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserProfile : AuditableEntity
    {
        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string Name { get; set; }
        
        public string Photo { get; set; }
        
        public Guid ConcurrencyStamp { get; set; }

        public Guid SecurityStamp { get; set; }


        public UserProfile() : base()
        {
            ConcurrencyStamp = Guid.NewGuid();

            SecurityStamp = Guid.NewGuid();
        }
    }


}
