using Azure.Data.Tables;
using Xunit;
using CloudResume.Backend;

namespace CloudResume.Tests;

public class VisitorEntityTests
{
    [Fact]
    public void VisitorEntity_DefaultCount_IsZero()
    {
        var entity = new VisitorEntity();
        Assert.Equal(0, entity.Count);
    }

    [Fact]
    public void VisitorEntity_DefaultPartitionKey_IsResume()
    {
        var entity = new VisitorEntity();
        Assert.Equal("resume", entity.PartitionKey);
    }

    [Fact]
    public void VisitorEntity_Increment_IncreasesCount()
    {
        var entity = new VisitorEntity { Count = 41 };
        entity.Count += 1;
        Assert.Equal(42, entity.Count);
    }
}