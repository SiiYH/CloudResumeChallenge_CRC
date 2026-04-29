using Azure;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace CloudResume.Backend;

public class VisitorEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "resume";
    public string RowKey { get; set; } = "visitorCount";
    public int count { get; set; } = 0;
    public ETag ETag { get; set; } = ETag.All;
    public DateTimeOffset? Timestamp { get; set; }
}

public class VisitorCounter
{
    private readonly ILogger<VisitorCounter> _logger;

    public VisitorCounter(ILogger<VisitorCounter> logger)
    {
        logger = _logger;
    }

    [Function("visitorCounter")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req
    )
    {
        _logger.LogInformation("Visitor Counter triggered.");

        var accountName = Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_NAME");
        var accountKey = Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_KEY");
        var tableName = Environment.GetEnvironmentVariable("TABLE_NAME");

        var credential = new TableSharedKeyCredential(accountName, accountKey);
        var client = new TableClient(
            new Uri($"https://{accountName}.table.core.window.net"),
            tableName,
            credential
        );
    }
}