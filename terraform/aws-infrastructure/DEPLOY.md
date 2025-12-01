# 🚀 Guia Rápido de Deploy - UPAE AWS

## ✅ Checklist Pré-Deploy

- [ ] AWS CLI configurado (`aws configure`)
- [ ] Terraform instalado (`terraform --version`)
- [ ] Credenciais AWS funcionando (`aws sts get-caller-identity`)

## 📝 Passo a Passo

### 1. Entre no diretório
```bash
cd terraform/aws-infrastructure
```

### 2. Inicialize o Terraform
```bash
terraform init
```
✅ Deve mostrar: "Terraform has been successfully initialized!"

### 3. (Opcional) Personalize configurações
```bash
# Copie o exemplo
cp terraform.tfvars.example terraform.tfvars

# Edite com seu editor preferido
notepad terraform.tfvars
```

### 4. Revise o que será criado
```bash
terraform plan
```
📊 Vai mostrar todos os recursos que serão criados (~40 recursos)

### 5. Execute o deploy
```bash
terraform apply
```
- Digite `yes` quando perguntado
- ⏱️ Aguarde 5-10 minutos

### 6. 🎉 Acesse o sistema!

Após o deploy, copie a URL mostrada:
```
Outputs:

load_balancer_url = "http://upae-agendamento-alb-XXXXXXXXX.us-east-1.elb.amazonaws.com"
```

Cole essa URL no navegador!

## 🔍 Comandos Úteis

### Ver outputs novamente
```bash
terraform output
```

### Ver URL do Load Balancer
```bash
terraform output load_balancer_url
```

### Verificar recursos criados
```bash
terraform state list
```

### Destruir tudo (cuidado!)
```bash
terraform destroy
```

## ⚠️ Troubleshooting

### Erro: "Error acquiring the state lock"
```bash
# Outra pessoa está usando ou processo travou
# Espere alguns minutos ou force:
terraform force-unlock <LOCK_ID>
```

### Erro: "No valid credential sources found"
```bash
# Configure suas credenciais AWS
aws configure
```

### Load Balancer retorna 503
- Aguarde 2-3 minutos (instâncias estão inicializando)
- Verifique health checks no console AWS

### Quero alterar número de instâncias
```bash
# Edite terraform.tfvars:
asg_desired_capacity = 3  # Mude de 2 para 3

# Aplique mudanças:
terraform apply
```

## 💰 Custos Estimados

### Com Free Tier (primeiro ano):
- **~$15/mês** (NAT Gateway é o maior custo)

### Sem Free Tier:
- **~$106/mês**

### Para reduzir custos:
1. Use 1 NAT Gateway em vez de 2
2. Use t3.nano em vez de t3.micro
3. Configure Auto Scaling para mínimo de 1 instância

## 🎯 Próximos Passos Após Deploy

1. ✅ Sistema rodando no Load Balancer
2. 🔄 Deploy da aplicação real (substituir placeholder)
3. 🌐 Configurar domínio próprio (Route 53)
4. 🔒 Adicionar HTTPS (ACM + certificado SSL)
5. 📊 Configurar monitoramento (CloudWatch)
6. 💾 Configurar backup

## 📞 Precisa de Ajuda?

1. Verifique os logs: `terraform show`
2. Leia o [README.md](README.md) completo
3. Console AWS > CloudFormation > Events (ver o que está acontecendo)
4. Console AWS > EC2 > Load Balancers (verificar status)

---

**Boa sorte com o deploy! 🚀**
