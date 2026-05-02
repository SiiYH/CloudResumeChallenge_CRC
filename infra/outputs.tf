output "static_web_app_url" {
  value = "https://${azurerm_static_web_app.resume.default_host_name}"
}

output "static_web_app_api_key" {
    description = "Used in GitHub Action to deploy frontend"
    value = azurerm_static_web_app.resume.api_key
    sensitive = true  
}

output "storage_account_name" {
  value = azurerm_storage_account.resume.name
}

output "storage_account_key" {
  value = azurerm_storage_account.resume.primary_access_key
  sensitive = true
}

output "visitor_table_name" {
  value = azurerm_storage_table.vistor_counter.name
}