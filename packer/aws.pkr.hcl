packer {
  required_plugins {
    amazon = {
      version = ">= 1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws-region" {
  type    = string
  default = "us-east-1"
}

variable "aws-profile" {
  type    = string
  default = "dev"
}

variable "source-ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh-username" {
  type    = string
  default = "admin"
}

variable "subnet-id" {
  type    = string
  default = "subnet-0731f505253577b49"
}

source "amazon-ebs" "csye6225-ami" {
  region          = "${var.aws-region}"
  ami_name        = "csye6225-ami-${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "CSYE6225 Assignment-05"
  profile         = "${var.aws-profile}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  ami_regions = [
    "us-east-1",
  ]

  instance_type = "t2.micro"
  source_ami    = "${var.source-ami}"
  ssh_username  = "${var.ssh-username}"
  subnet_id     = "${var.subnet-id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.csye6225-ami"
  ]

  provisioner "shell" {
    script = "setup.sh"
  }
}
