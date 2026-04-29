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