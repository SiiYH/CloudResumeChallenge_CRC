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
    public int Count { get; set; } = 0;
    public ETag ETag { get; set; } = ETag.All;
    public DateTimeOffset? Timestamp { get; set; }
}

public class VisitorCounter
{
    private readonly ILogger<VisitorCounter> _logger;

    public VisitorCounter(ILogger<VisitorCounter> logger)
    {
        _logger = logger;
    }

    [Function("visitorCounter")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req
    )
    {
        _logger.LogInformation("Visitor Counter triggered.");

        var accountName = Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_NAME")!;
        var accountKey = Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_KEY");
        var tableName = Environment.GetEnvironmentVariable("TABLE_NAME");

        var credential = new TableSharedKeyCredential(accountName, accountKey);
        var client = new TableClient(
            new Uri($"https://{accountName}.table.core.window.net"),
            tableName,
            credential
        );

        await client.CreateIfNotExistsAsync();
        VisitorEntity entity;

        try
        {
            var result = await client.GetEntityAsync<VisitorEntity>("resume", "visitorCount");
            entity = result.Value;
        } catch (RequestFailedException ex) when (ex.Status == 404)
        {
            //first visitor
            entity = new VisitorEntity();
        }

        entity.Count += 1;
        await client.UpsertEntityAsync(entity, TableUpdateMode.Replace);

        _logger.LogInformation("Visitor count update to {Count}", entity.Count);

        return new OkObjectResult(new {count = entity.Count});
        
    }
}