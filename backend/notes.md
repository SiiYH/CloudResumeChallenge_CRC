# Run it before func start
azurite --silent --location ./azurite-data --debug azurite.log

# Install Azure Functions templates
dotnet new install Microsoft.Azure.Functions.Worker.ProjectTemplates

# Then retry
dotnet new httptrigger \
  --name VisitorCounter \
  --namespace CloudResume.Backend \
  --force

cd backend
  
dotnet add package Azure.Data.Tables

dotnet new list --tag azure-function

cd backend

# 1. Restore packages
dotnet restore

# 2. Build — should have 0 errors
dotnet build

# 3. Run tests
dotnet test tests/

dotnet add package Azure.Data.Tables

dotnet nuget locals all --clear

# Root cause
backend.csproj was implicitly compiling all .cs files under backend, including VisitorCounter.cs.
That test file used xunit, but backend.csproj did not reference the xunit package, so build failed.
VisitorCounter.cs also had a real bug:
logger = _logger; should be _logger = logger;
Program.cs had an invalid builder.Services statement after commenting out Application Insights setup.

# What changed
backend.csproj
Added Compile Remove="tests\**\*.cs" so test files are excluded from the backend function app build.
VisitorCounter.cs
Fixed the logger constructor assignment to _logger = logger;
Program.cs
Removed the leftover invalid builder.Services statement.

# Result
dotnet build in backend now succeeds.