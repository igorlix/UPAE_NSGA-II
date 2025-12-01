# 🚀 Deploy do Sistema UPAE na AWS

## ✅ Infraestrutura Criada

Criei uma infraestrutura completa usando **Terraform** para hospedar o sistema UPAE na AWS com:

### Componentes Principais:
- ✅ **Application Load Balancer (ALB)** - Balanceamento de carga HTTP/HTTPS
- ✅ **Auto Scaling Group** - 2 a 4 instâncias EC2 (escalabilidade automática)
- ✅ **VPC personalizada** - Rede isolada e segura
- ✅ **Subnets públicas e privadas** - Em 2 zonas de disponibilidade
- ✅ **NAT Gateways** - Para instâncias privadas acessarem internet
- ✅ **Security Groups** - Firewall configurado
- ✅ **CloudWatch** - Monitoramento e logs
- ✅ **Auto Scaling Policies** - Escala baseada em CPU

### Arquivos Criados:
```
terraform/aws-infrastructure/
├── main.tf                    # VPC, networking, routing
├── ec2.tf                     # EC2, Auto Scaling, IAM roles
├── load-balancer.tf           # ALB, Target Groups, Listeners
├── variables.tf               # Variáveis configuráveis
├── outputs.tf                 # Outputs após deploy
├── user-data.sh              # Script de setup das instâncias
├── .gitignore                # Arquivos ignorados pelo Git
├── terraform.tfvars.example  # Exemplo de configuração
├── README.md                 # Documentação completa
├── DEPLOY.md                 # Guia rápido
└── deploy.bat                # Script automatizado (Windows)
```

## 🎯 Como Fazer o Deploy

### Opção 1: Script Automatizado (Windows)
```bash
cd terraform/aws-infrastructure
deploy.bat
```

### Opção 2: Manual (Linux/Mac/Windows)
```bash
cd terraform/aws-infrastructure

# 1. Inicializar
terraform init

# 2. Revisar o que será criado
terraform plan

# 3. Executar deploy
terraform apply
```

Digite `yes` quando solicitado.

## ⏱️ Tempo e Custos

- **Tempo de deploy**: 5-10 minutos
- **Custo estimado**:
  - Com Free Tier (1º ano): ~$15/mês
  - Sem Free Tier: ~$106/mês

### Principais custos:
- NAT Gateway: ~$32.50/mês cada (2x = $65)
- ALB: ~$16.50/mês
- EC2 t3.micro: ~$7.50/mês cada (2x = $15, grátis no free tier)

## 📋 Pré-requisitos

1. **AWS CLI configurado**
   ```bash
   aws configure
   # Insira suas credenciais de administrador
   ```

2. **Terraform instalado**
   - Windows: `choco install terraform`
   - Mac: `brew install terraform`
   - Linux: [Download manual](https://www.terraform.io/downloads)

3. **Verificar instalação**
   ```bash
   terraform --version
   aws sts get-caller-identity
   ```

## 🌐 Após o Deploy

O Terraform mostrará a URL do sistema:

```
Outputs:

load_balancer_url = "http://upae-agendamento-alb-123456789.us-east-1.elb.amazonaws.com"
```

**Acesse essa URL no navegador!**

### Primeiro acesso:
- Aguarde 2-3 minutos para as instâncias ficarem saudáveis
- Você verá uma página placeholder
- Depois precisa fazer upload da aplicação real

## 📦 Deploy da Aplicação Real

Atualmente o servidor está com um HTML placeholder. Para colocar o sistema UPAE real:

### Opção A: Manual via Session Manager

1. No console AWS: **EC2 > Instances > Connect > Session Manager**

2. Dentro da instância:
   ```bash
   cd /var/www/upae

   # Faça upload via S3 ou Git
   # Exemplo com Git:
   sudo git clone https://github.com/seu-repo/upae.git .

   # Ou copie os arquivos
   sudo chown -R nginx:nginx /var/www/upae
   sudo systemctl reload nginx
   ```

### Opção B: Modificar user-data.sh

1. Edite `terraform/aws-infrastructure/user-data.sh` (linha 25)
2. Adicione o comando para clonar seu repositório Git
3. Execute: `terraform apply` (recria instâncias)

## 🔧 Personalizações

### Mudar região AWS
```hcl
# terraform.tfvars
aws_region = "sa-east-1"  # São Paulo
```

### Ajustar número de instâncias
```hcl
# terraform.tfvars
asg_min_size         = 1
asg_max_size         = 6
asg_desired_capacity = 2
```

### Usar instâncias maiores
```hcl
# terraform.tfvars
instance_type = "t3.small"  # Mais poderosa
```

### Limitar acesso SSH
```hcl
# terraform.tfvars
ssh_allowed_cidr = ["203.0.113.0/32"]  # Seu IP público
```

## 🔒 Adicionar HTTPS (SSL)

1. **Registre um domínio** (Route 53 ou outro registrar)

2. **Crie certificado SSL** no AWS Certificate Manager (ACM)
   - Console AWS > ACM > Request Certificate
   - Valide via DNS ou email

3. **Descomente listener HTTPS** em `load-balancer.tf`:
   ```hcl
   # Remova os comentários das linhas 75-85
   ```

4. **Configure variável**:
   ```hcl
   # terraform.tfvars
   ssl_certificate_arn = "arn:aws:acm:us-east-1:123:certificate/abc..."
   ```

5. **Aplique mudanças**:
   ```bash
   terraform apply
   ```

## 📊 Monitoramento

### CloudWatch Dashboards
- Console AWS > CloudWatch > Dashboards
- Métricas: CPU, memória, rede, requests

### Logs
```bash
aws logs tail /aws/ec2/upae/nginx/access --follow
aws logs tail /aws/ec2/upae/nginx/error --follow
```

### Alarmes Configurados
- ✅ CPU alta (>70%) - escala para cima
- ✅ CPU baixa (<20%) - escala para baixo
- ✅ Hosts não saudáveis
- ✅ Tempo de resposta alto

## 🗑️ Destruir Infraestrutura

**ATENÇÃO**: Isso remove TUDO e é irreversível!

```bash
cd terraform/aws-infrastructure
terraform destroy
```

Digite `yes` para confirmar.

## 🆘 Troubleshooting

### Load Balancer retorna 503
- Aguarde 2-3 minutos (health checks inicializando)
- Verifique Target Group no console AWS
- Confirme que Security Groups estão corretos

### Erro de credenciais AWS
```bash
aws configure
# Reinsira suas credenciais
```

### Custos muito altos
- Considere usar apenas 1 NAT Gateway
- Mude para instâncias t3.nano
- Configure Auto Scaling para escalar para 0 à noite

### Erro "state locked"
```bash
# Aguarde alguns minutos ou:
terraform force-unlock <LOCK_ID>
```

## 📚 Recursos

- [README completo](terraform/aws-infrastructure/README.md)
- [Guia de deploy](terraform/aws-infrastructure/DEPLOY.md)
- [Documentação Terraform AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

## ✅ Checklist Completo

- [ ] AWS CLI configurado
- [ ] Terraform instalado
- [ ] Credenciais AWS testadas
- [ ] Executar `terraform init`
- [ ] Executar `terraform apply`
- [ ] Aguardar conclusão (5-10 min)
- [ ] Acessar URL do Load Balancer
- [ ] Fazer upload da aplicação real
- [ ] (Opcional) Configurar domínio
- [ ] (Opcional) Adicionar HTTPS
- [ ] (Opcional) Configurar backup

---

## 🎉 Pronto!

Sua infraestrutura AWS está configurada e pronta para uso. Execute os comandos acima e em poucos minutos terá um sistema escalável, seguro e monitorado rodando na nuvem AWS!

**Boa sorte com o deploy! 🚀**
