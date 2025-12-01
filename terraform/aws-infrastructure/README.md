# 🏥 UPAE - Infraestrutura AWS com Terraform

Infraestrutura completa para deploy do Sistema de Agendamento UPAE na AWS usando Terraform.

## 📋 Pré-requisitos

1. **AWS CLI configurado**
   ```bash
   aws configure
   # Insira suas credenciais de admin
   ```

2. **Terraform instalado** (versão >= 1.0)
   ```bash
   # Windows (Chocolatey)
   choco install terraform

   # macOS (Homebrew)
   brew install terraform

   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

3. **Verificar instalação**
   ```bash
   terraform --version
   aws sts get-caller-identity
   ```

## 🏗️ Arquitetura

Esta infraestrutura cria:

- **VPC** com subnets públicas e privadas em 2 zonas de disponibilidade
- **Application Load Balancer (ALB)** público
- **Auto Scaling Group** com 2-4 instâncias EC2 (t3.micro)
- **NAT Gateways** para acesso à internet das instâncias privadas
- **Security Groups** configurados corretamente
- **CloudWatch** para logs e métricas
- **Auto Scaling policies** baseadas em CPU

```
Internet
   │
   ↓
Application Load Balancer (público)
   │
   ├─→ EC2 Instance 1 (subnet privada AZ-1)
   ├─→ EC2 Instance 2 (subnet privada AZ-2)
   └─→ Auto Scaling Group (2-4 instâncias)
```

## 🚀 Deploy Rápido

### 1. Navegue até o diretório Terraform

```bash
cd d:/Documentos/CN/terraform/aws-infrastructure
```

### 2. Inicialize o Terraform

```bash
terraform init
```

### 3. (Opcional) Personalize as variáveis

Crie um arquivo `terraform.tfvars`:

```hcl
# terraform.tfvars
aws_region           = "us-east-1"
project_name         = "upae-agendamento"
environment          = "production"
instance_type        = "t3.micro"
asg_min_size         = 2
asg_max_size         = 4
asg_desired_capacity = 2

# IMPORTANTE: Mude para seu IP público para maior segurança
ssh_allowed_cidr = ["0.0.0.0/0"]  # Ou ["SEU_IP_PUBLICO/32"]
```

### 4. Revise o plano de execução

```bash
terraform plan
```

### 5. Execute o deploy

```bash
terraform apply
```

Digite `yes` quando solicitado.

⏱️ **Tempo estimado**: 5-10 minutos

### 6. Acesse o sistema

Após o deploy, o Terraform mostrará o DNS do Load Balancer:

```
Outputs:

load_balancer_url = "http://upae-agendamento-alb-123456789.us-east-1.elb.amazonaws.com"
```

Acesse essa URL no navegador!

## 📊 Recursos Criados

| Recurso | Quantidade | Descrição |
|---------|-----------|-----------|
| VPC | 1 | Rede virtual isolada |
| Subnets públicas | 2 | Para o Load Balancer |
| Subnets privadas | 2 | Para as instâncias EC2 |
| Internet Gateway | 1 | Acesso à internet |
| NAT Gateways | 2 | Para instâncias privadas |
| Application Load Balancer | 1 | Balanceamento de carga |
| Target Group | 1 | Grupo de destino |
| Auto Scaling Group | 1 | Escalabilidade automática |
| EC2 Instances | 2-4 | Servidores web (t3.micro) |
| Security Groups | 2 | Firewall virtual |
| CloudWatch Alarms | 4 | Monitoramento |
| IAM Role | 1 | Permissões para EC2 |

## 💰 Estimativa de Custos (us-east-1)

### Ambiente de Desenvolvimento (2 t3.micro)
- EC2 (2x t3.micro): ~$15/mês (750h free tier no primeiro ano)
- ALB: ~$16.50/mês
- NAT Gateway (2x): ~$65/mês
- Data Transfer: ~$10/mês
- **Total: ~$106/mês** (ou ~$15/mês no free tier)

### Otimizações de custo:
1. Use apenas 1 NAT Gateway: economiza ~$32.50/mês
2. Use t3.nano em vez de t3.micro: economiza ~$7.50/mês
3. Configure instâncias em subnets públicas: elimina NAT (~$65/mês)

## 🔧 Comandos Úteis

### Ver estado atual
```bash
terraform show
```

### Ver outputs novamente
```bash
terraform output
```

### Atualizar infraestrutura após mudanças
```bash
terraform apply
```

### Destruir toda a infraestrutura
```bash
terraform destroy
```

### Ver recursos específicos
```bash
terraform state list
terraform state show aws_lb.main
```

### Formatar arquivos Terraform
```bash
terraform fmt
```

### Validar configuração
```bash
terraform validate
```

## 📦 Deploy da Aplicação

Após a infraestrutura estar pronta, você precisa fazer upload dos arquivos da aplicação.

### Opção 1: Manual via S3 + Script

1. Compacte sua aplicação:
```bash
cd d:/Documentos/CN
tar -czf upae-app.tar.gz index.html resultado.html login.html politica-privacidade.html src/ public/
```

2. Faça upload para S3:
```bash
aws s3 mb s3://upae-aplicacao-deploy
aws s3 cp upae-app.tar.gz s3://upae-aplicacao-deploy/
```

3. SSH nas instâncias (via Session Manager):
```bash
# No console AWS, vá em EC2 > Instances > Connect > Session Manager

# Dentro da instância:
aws s3 cp s3://upae-aplicacao-deploy/upae-app.tar.gz /tmp/
cd /var/www/upae
sudo tar -xzf /tmp/upae-app.tar.gz
sudo chown -R nginx:nginx /var/www/upae
sudo systemctl reload nginx
```

### Opção 2: Via Git (Recomendado)

1. Faça push do código para um repositório Git

2. Modifique o [user-data.sh](user-data.sh) (linha 25):
```bash
git clone https://github.com/seu-usuario/upae-sistema.git .
```

3. Recrie as instâncias:
```bash
terraform taint aws_launch_template.web_server
terraform apply
```

## 🔒 Segurança

### Recomendações Importantes:

1. **Limite acesso SSH**
   ```hcl
   ssh_allowed_cidr = ["SEU_IP_PUBLICO/32"]
   ```

2. **Habilite HTTPS**
   - Registre um domínio
   - Crie certificado SSL no ACM
   - Descomente o listener HTTPS no [load-balancer.tf](load-balancer.tf)

3. **Habilite deletion protection**
   ```hcl
   enable_deletion_protection = true
   ```

4. **Configure backup**
   - Snapshots automáticos de EBS
   - Versionamento de S3

5. **WAF (Web Application Firewall)**
   ```hcl
   resource "aws_wafv2_web_acl_association" "main" {
     resource_arn = aws_lb.main.arn
     web_acl_arn  = aws_wafv2_web_acl.main.arn
   }
   ```

## 🔍 Monitoramento

### CloudWatch Dashboards

Acesse: AWS Console > CloudWatch > Dashboards

Métricas importantes:
- CPU Utilization
- Network In/Out
- Healthy Host Count
- Request Count
- Target Response Time

### Logs

```bash
# Ver logs do Nginx
aws logs tail /aws/ec2/upae/nginx/access --follow
aws logs tail /aws/ec2/upae/nginx/error --follow
```

## 🔄 Atualizações

### Atualizar configuração Terraform
```bash
# Modifique os arquivos .tf
terraform plan
terraform apply
```

### Atualizar a aplicação
```bash
# Execute nas instâncias via Session Manager
sudo /usr/local/bin/update-upae.sh
```

### Rolling update das instâncias
```bash
# Isso recria todas as instâncias gradualmente
terraform taint aws_launch_template.web_server
terraform apply
```

## 🆘 Troubleshooting

### Load Balancer mostra 503 Service Unavailable
- Verifique se as instâncias estão saudáveis no Target Group
- Aguarde 2-3 minutos após o deploy inicial
- Verifique Security Groups

### Não consigo acessar o Load Balancer
- Verifique se o Security Group do ALB permite porta 80
- Confirme se as instâncias estão rodando
- Verifique os health checks

### Auto Scaling não está funcionando
- Verifique CloudWatch Alarms
- Confirme que as métricas estão sendo coletadas
- Ajuste thresholds se necessário

### Custos muito altos
- Verifique NAT Gateway (maior custo)
- Considere usar subnets públicas para instâncias
- Use instâncias menores (t3.nano)
- Configure Auto Scaling para escalar para 0 à noite

## 📚 Arquivos do Projeto

```
terraform/aws-infrastructure/
├── main.tf              # VPC, subnets, routing
├── ec2.tf               # Instâncias, Auto Scaling, IAM
├── load-balancer.tf     # ALB, Target Groups, Listeners
├── variables.tf         # Variáveis de configuração
├── outputs.tf           # Outputs após deploy
├── user-data.sh         # Script de inicialização das EC2
├── terraform.tfvars     # (criar) Valores das variáveis
└── README.md            # Esta documentação
```

## 🎯 Próximos Passos

1. ✅ Deploy da infraestrutura
2. ⬜ Configurar domínio personalizado (Route 53)
3. ⬜ Adicionar certificado SSL (ACM)
4. ⬜ Habilitar HTTPS
5. ⬜ Configurar backup automático
6. ⬜ Configurar CI/CD (GitHub Actions ou CodePipeline)
7. ⬜ Adicionar WAF para segurança
8. ⬜ Configurar RDS para banco de dados (se necessário)

## 📞 Suporte

- [Documentação Terraform AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

## 📄 Licença

Sistema desenvolvido para a Secretaria de Saúde do Estado de Pernambuco.
