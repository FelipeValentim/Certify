namespace Domain.Entities
{
	public class AuditableEntity : EntityBase
	{
		public AuditableEntity() : base() 
		{
			CreatedDate = DateTime.UtcNow;

			DeletedDate = null;
		}

		public DateTime CreatedDate { get; set; }
		public DateTime? DeletedDate { get; set; }

	}
}
