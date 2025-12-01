# Outputs - Informações importantes após o deploy

output "vpc_id" {
  description = "ID da VPC criada"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs das subnets públicas"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs das subnets privadas"
  value       = aws_subnet.private[*].id
}

output "load_balancer_dns" {
  description = "DNS público do Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "load_balancer_url" {
  description = "URL completa do sistema"
  value       = "http://${aws_lb.main.dns_name}"
}

output "load_balancer_zone_id" {
  description = "Zone ID do Load Balancer (para configurar Route53)"
  value       = aws_lb.main.zone_id
}

output "load_balancer_arn" {
  description = "ARN do Load Balancer"
  value       = aws_lb.main.arn
}

output "auto_scaling_group_name" {
  description = "Nome do Auto Scaling Group"
  value       = aws_autoscaling_group.web_server.name
}

output "web_server_security_group_id" {
  description = "ID do Security Group das instâncias web"
  value       = aws_security_group.web_server.id
}

output "alb_security_group_id" {
  description = "ID do Security Group do Load Balancer"
  value       = aws_security_group.alb.id
}

output "target_group_arn" {
  description = "ARN do Target Group"
  value       = aws_lb_target_group.web.arn
}

output "iam_role_name" {
  description = "Nome da IAM Role das instâncias EC2"
  value       = aws_iam_role.web_server.name
}

# Instruções de acesso
output "instructions" {
  description = "Instruções para acessar o sistema"
  value       = <<-EOT

    ========================================
    SISTEMA UPAE - DEPLOY CONCLUÍDO
    ========================================

    🌐 Acesse o sistema em:
       ${aws_lb.main.dns_name}

    📊 Monitoramento:
       - CloudWatch Logs
       - CloudWatch Metrics
       - Auto Scaling Events

    🔒 Acesso SSH às instâncias:
       Use AWS Systems Manager Session Manager
       (não precisa de chave SSH)

    📝 Próximos passos:
       1. Configure um domínio personalizado no Route 53
       2. Adicione certificado SSL no ACM
       3. Ative HTTPS no Load Balancer
       4. Configure backup e monitoramento

    ⚠️  Segurança:
       - Revise os Security Groups
       - Limite acesso SSH ao seu IP
       - Habilite deletion protection em produção

    ========================================
  EOT
}
