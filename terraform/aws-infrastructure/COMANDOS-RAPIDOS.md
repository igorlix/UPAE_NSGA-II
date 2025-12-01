# ⚡ Comandos Rápidos - UPAE AWS

## 🚀 Deploy Inicial

```bash
# 1. Entrar no diretório
cd terraform/aws-infrastructure

# 2. Inicializar Terraform
terraform init

# 3. Ver o plano
terraform plan

# 4. Executar deploy
terraform apply

# 5. Ver URL do sistema
terraform output load_balancer_url
```

## 🔍 Verificar Sistema

### Ver Outputs
```bash
terraform output
terraform output load_balancer_url
```

### Testar API
```bash
# Substituir pela sua URL
curl http://upae-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com/api/health
```

### Testar Frontend
```bash
# Abrir no navegador
start http://upae-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com
```

## 🔧 SSH nas Instâncias (Session Manager)

```bash
# 1. Listar instâncias
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=upae-agendamento*" \
  --query "Reservations[].Instances[].[InstanceId,State.Name,PublicIpAddress]" \
  --output table

# 2. Conectar via Session Manager (melhor que SSH)
aws ssm start-session --target i-XXXXXXXXXXXXXXXXX
```

### Dentro da instância:
```bash
# Ver status dos serviços
sudo systemctl status nginx
sudo systemctl status upae-api

# Health check completo
sudo /usr/local/bin/health-check-upae.sh

# Ver logs
sudo journalctl -u upae-api -f
sudo tail -f /var/log/nginx/upae_error.log

# Testar API localmente
curl http://localhost:5000/health
```

## 🔄 Atualizar Aplicação

### Dentro da instância:
```bash
sudo /usr/local/bin/update-upae.sh
```

### Recriar instâncias com nova configuração:
```bash
# Força recriação de todas as instâncias
terraform taint aws_launch_template.web_server
terraform apply
```

## 📊 Logs no CloudWatch

```bash
# Ver logs de acesso (Nginx)
aws logs tail /aws/ec2/upae/nginx/access --follow

# Ver logs de erro (Nginx)
aws logs tail /aws/ec2/upae/nginx/error --follow

# Ver logs do systemd (API Python)
# Dentro da instância:
sudo journalctl -u upae-api -f
```

## 🔧 Debug da API

### Testar endpoint de health
```bash
curl http://LOAD-BALANCER-URL/api/health
```

### Testar otimização (teste rápido)
```bash
curl -X POST http://LOAD-BALANCER-URL/api/otimizar \
  -H "Content-Type: application/json" \
  -d '{
    "paciente": {
      "id": "teste-1",
      "especialidade": "Cardiologia",
      "lat": -8.0476,
      "lon": -34.8770,
      "idade": 45
    },
    "upaes": [{
      "id": "upae-arruda",
      "nome": "UPAE Arruda",
      "especialidades": ["Cardiologia"],
      "lat": -8.0476,
      "lon": -34.9085,
      "tempo_espera_dias": 5,
      "transport_score": 0.8
    }]
  }'
```

## 🛠️ Troubleshooting

### Reiniciar API Python
```bash
# Dentro da instância
sudo systemctl restart upae-api
sudo systemctl status upae-api
```

### Reiniciar Nginx
```bash
sudo systemctl reload nginx
sudo systemctl status nginx
```

### Ver erros recentes
```bash
sudo journalctl -u upae-api -n 100 --no-pager
sudo tail -n 100 /var/log/nginx/upae_error.log
```

### Reinstalar dependências Python
```bash
cd /opt/upae-api
sudo pip3 install -r requirements.txt
sudo systemctl restart upae-api
```

## 📈 Monitoramento

### Ver métricas no CloudWatch
```bash
# CPU Utilization
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=AutoScalingGroupName,Value=upae-agendamento-asg \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# Healthy Host Count (ALB)
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HealthyHostCount \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

### Ver status do Target Group
```bash
# Listar target groups
aws elbv2 describe-target-groups \
  --names upae-agendamento-tg

# Ver health dos targets
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:REGION:ACCOUNT:targetgroup/...
```

## 🔥 Auto Scaling

### Escalar manualmente
```bash
# Aumentar capacidade desejada
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name upae-agendamento-asg \
  --desired-capacity 4

# Ver atividade do Auto Scaling
aws autoscaling describe-scaling-activities \
  --auto-scaling-group-name upae-agendamento-asg \
  --max-records 10
```

## 🗑️ Destruir Infraestrutura

### ⚠️ CUIDADO: Remove TUDO!

```bash
cd terraform/aws-infrastructure

# Ver o que será destruído
terraform plan -destroy

# Destruir (IRREVERSÍVEL!)
terraform destroy
```

## 💾 Backup e Restore

### Fazer backup manual
```bash
# Dentro da instância
sudo tar -czf /tmp/upae-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  /var/www/upae \
  /opt/upae-api

# Copiar para S3
aws s3 cp /tmp/upae-backup-*.tar.gz s3://meu-bucket/backups/
```

### Restore do backup
```bash
# Download do S3
aws s3 cp s3://meu-bucket/backups/upae-backup-20250101-120000.tar.gz /tmp/

# Extrair
sudo tar -xzf /tmp/upae-backup-20250101-120000.tar.gz -C /

# Reiniciar serviços
sudo systemctl restart upae-api nginx
```

## 📦 Variáveis Úteis

```bash
# Região AWS
export AWS_REGION=us-east-1

# Nome do projeto
export PROJECT_NAME=upae-agendamento

# Load Balancer DNS
export LB_DNS=$(terraform output -raw load_balancer_url)

# Usar variável
echo $LB_DNS
curl $LB_DNS/api/health
```

## 🎯 Comandos de Produção

### Habilitar deletion protection
```bash
cd terraform/aws-infrastructure

# Editar terraform.tfvars
echo 'enable_deletion_protection = true' >> terraform.tfvars

terraform apply
```

### Mudar tipo de instância
```bash
# Editar terraform.tfvars
echo 'instance_type = "t3.small"' >> terraform.tfvars

terraform apply
```

### Ajustar Auto Scaling
```bash
# Editar terraform.tfvars
cat >> terraform.tfvars << EOF
asg_min_size = 2
asg_max_size = 6
asg_desired_capacity = 3
EOF

terraform apply
```

## 🔐 Segurança

### Limitar acesso SSH ao seu IP
```bash
# Descobrir seu IP público
curl ifconfig.me

# Editar terraform.tfvars
echo 'ssh_allowed_cidr = ["SEU_IP/32"]' >> terraform.tfvars

terraform apply
```

### Ver Security Groups
```bash
aws ec2 describe-security-groups \
  --filters "Name=tag:Project,Values=UPAE-Sistema-Agendamento" \
  --query "SecurityGroups[*].[GroupId,GroupName,Description]" \
  --output table
```

## 📝 Aliases Úteis (adicionar ao ~/.bashrc)

```bash
alias upae-status="terraform output"
alias upae-logs="aws logs tail /aws/ec2/upae/nginx/access --follow"
alias upae-errors="aws logs tail /aws/ec2/upae/nginx/error --follow"
alias upae-health="curl \$(terraform output -raw load_balancer_url)/api/health"
alias upae-ssh="aws ssm start-session --target"
```

## 🎓 Comandos Educacionais

### Ver recursos criados
```bash
terraform state list
```

### Ver detalhes de um recurso
```bash
terraform state show aws_lb.main
terraform state show aws_autoscaling_group.web_server
```

### Ver graph (precisa do Graphviz)
```bash
terraform graph | dot -Tsvg > graph.svg
```

---

**Salve este arquivo! É seu guia de referência rápida.** 📖
