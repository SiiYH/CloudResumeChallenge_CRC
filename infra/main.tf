resource "azurerm_resource_group" "rg" {
  name = "rg-cloud-resume-${var.environment}"
  location = var.location
}

resource "azurerm_storage_account" "resume" {
  name = "stresume${var.unique_suffix}"
  resource_group_name = azurerm_resource_group.rg.name
  location = azurerm_resource_group.rg.location

  account_tier = "Standard"
  account_replication_type = "LRS"
  account_kind = "StorageV2"
  
  min_tls_version = "TLS1_2"
  https_traffic_only_enabled = true
}

/* resource "azurerm_storage_account_static_website" "resume" {
  storage_account_id = azurerm_storage_account.resume.id
  index_document = "index.html"
  error_404_document = "error.html"
} */

resource "azurerm_storage_table" "vistor_counter" {
  name = "visitorCounter"
  storage_account_name = azurerm_storage_account.resume.name
}

resource "azurerm_static_web_app" "resume" {
  name = "swa-resume-${var.unique_suffix}"
  resource_group_name = azurerm_resource_group.rg.name
  location = var.swa_location
  sku_size = "Free"
  sku_tier = "Free"
}

/* resource "azurerm_storage_blob" "frontend" {
  for_each = local.frontend_files

  name = each.value
  storage_account_name = azurerm_storage_account.resume.name
  storage_container_name = "$web"
  type = "Block"
  source = "/frontend/${each.value}"
  content_md5 = filemd5("/frontend/${each.value}")
  content_type = lookup({
    "html" = "text/html"
    "css" = "text/css"
    "js" = "application/javascript"
    "png" = "image/png"
    "jpg" = "image/jpeg"
    "ico" = "image/x-icon"
  }, split(".", each.value)[length(split(".", each.value))-1], "application/octet-stream" )
} */

///creating azure function app to host the api for visitor counter, and link it to the storage table
resource "azurerm_service_plan" "resume" {
  name = "asp-resume-${var.unique_suffix}"
  resource_group_name = azurerm_resource_group.rg.name
  location = azurerm_resource_group.rg.location
  sku_name = "Y1"
  os_type = "Linux"
}

resource "azurerm_linux_function_app" "resume" {
  name = "alfa-resume-${var.unique_suffix}"
  resource_group_name = azurerm_resource_group.rg.name
  location = azurerm_resource_group.rg.location
  service_plan_id = azurerm_service_plan.resume.id
  storage_account_name = azurerm_storage_account.resume.name
  storage_account_access_key = azurerm_storage_account.resume.primary_access_key

  site_config {
    application_stack {
      dotnet_version = "8.0"
      use_dotnet_isolated_runtime = true
    }

    cors {
      allowed_origins = [
        "https://${azurerm_static_web_app.resume.default_host_name}"
      ]
      support_credentials = false
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME" = "dotnet-isolated"
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "STORAGE_ACCOUNT_NAME" = azurerm_storage_account.resume.name
    "STORAGE_ACCOUNT_KEY" = azurerm_storage_account.resume.primary_access_key
    "TABLE_NAME" = azurerm_storage_table.vistor_counter.name
  }
}
