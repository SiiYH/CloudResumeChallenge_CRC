using Azure;
using Azure.Data.Tables;

namespace CloudResume.Backend;

public class VisitorEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "resume";
    public string RowKey { get; set; } = "visitorCount";
    public int count { get; set; } = 0;
    public ETag ETag { get; set; } = ETag.All;
    public DateTimeOffset? Timestamp { get; set; }
}

