variable "subscription_id"{
  description = "subscription id to publish the resources"
  type = string
  sensitive = true
}
variable "environment" {
  description = "current environment to deploy resources"
  type = string
  default = "prod"
}

variable "location" {
  description = "azure region to deploy resources"
  type = string
  default = "souteastasia"
}

variable "unique_suffix" {
  description = "Unique suffix for globally unique resource"
  type = string
}

variable "swa_location" {
  description = "static web app location"
  type = string
  default = "eastasia"
}

