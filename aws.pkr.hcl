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
  default = "{{env `AWS_REGION`}}"
}

# variable "aws-profile" {
#   type    = string
#   default = "{{env `AWS_PROFILE`}}"
# }

variable "source-ami" {
  type    = string
  default = "{{env `SOURCE_AMI`}}"
}

variable "ssh-username" {
  type    = string
  default = "{{env `SSH_USERNAME`}}"
}

variable "subnet-id" {
  type    = string
  default = "{{env `SUBNET_ID`}}"
}

source "amazon-ebs" "csye6225-ami" {
  region          = "${var.aws-region}"
  ami_name        = "csye6225-ami-${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "CSYE6225 Assignment-05"
  # profile         = "${var.aws-profile}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  ami_regions = [
    "${var.aws-region}",
  ]

  ami_users = [
    "{{env `AMI_USER_DEMO`}}",
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

  provisioner "file" {
    source      = "user.csv"
    destination = "/tmp/user.csv"
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "setup.sh"
  }
}
