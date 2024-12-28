namespace Domain.Entities
{
	public class AuditableEntity : EntityBase
	{
		public AuditableEntity() : base() 
		{
			CreationDate = DateTime.Now;

			DateDeleted = null;
		}

		public DateTime CreationDate { get; set; }
		public DateTime? DateDeleted { get; set; }

	}
}
