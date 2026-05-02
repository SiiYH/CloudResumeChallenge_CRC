# Plan and save
When you DO need -var-file
Only when our file has a custom name like secrets.tfvars:
```
terraform plan -var-file="secrets.tfvars" -out="tfplan"
```
So if we rename our file to terraform.tfvars, we can drop the -var-file flag entirely.

# Review the plan output, then apply
```
terraform apply "tfplan"
```

# Clean up the plan file
```
rm tfplan
```
SWA_DEPLOYMENT_TOKEN 
```
terraform output -raw static_web_app_api_key
```

storage account key
```
terraform output -raw storage_account_key
```