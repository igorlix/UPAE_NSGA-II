# 🏗️ Arquitetura da Infraestrutura AWS - Sistema UPAE

## 📐 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET                                     │
│                            │                                         │
│                            ↓                                         │
│  ┌────────────────────────────────────────────────────────┐        │
│  │     Application Load Balancer (ALB)                    │        │
│  │     - HTTP/HTTPS                                        │        │
│  │     - Health Checks                                     │        │
│  │     - SSL Termination (opcional)                        │        │
│  └────────────────┬───────────────────┬────────────────────┘        │
│                   │                   │                              │
└───────────────────┼───────────────────┼──────────────────────────────┘
                    │                   │
      ┌─────────────┴────────┬─────────┴─────────────┐
      │                      │                        │
┌─────▼──────┐         ┌─────▼──────┐         ┌──────▼─────┐
│ AZ 1       │         │ AZ 2       │         │ AZ 3       │
│ us-east-1a │         │ us-east-1b │         │ (futuro)   │
└────────────┘         └────────────┘         └────────────┘
      │                      │
      │ Public Subnet        │ Public Subnet
      │ 10.0.0.0/24         │ 10.0.1.0/24
      │                      │
      │ NAT Gateway          │ NAT Gateway
      │      │               │      │
      └──────┼───────────────┼──────┘
             │               │
      ┌──────▼───────────────▼──────┐
      │                              │
      │ Private Subnet               │ Private Subnet
      │ 10.0.10.0/24                │ 10.0.11.0/24
      │                              │
      │  ┌──────────────┐           │  ┌──────────────┐
      │  │ EC2 Instance │           │  │ EC2 Instance │
      │  │  - Nginx     │           │  │  - Nginx     │
      │  │  - App UPAE  │           │  │  - App UPAE  │
      │  │  - CloudWatch│           │  │  - CloudWatch│
      │  └──────────────┘           │  └──────────────┘
      │                              │
      │  Auto Scaling Group          │
      │  Min: 2 | Max: 4            │
      └──────────────────────────────┘
```

## 🔄 Fluxo de Requisição

1. **Usuário acessa** → http://upae-alb-xxx.elb.amazonaws.com
2. **DNS resolve** → IP público do Load Balancer
3. **ALB recebe** → Faz health check das instâncias
4. **ALB distribui** → Round-robin entre instâncias saudáveis
5. **EC2 processa** → Nginx serve a aplicação UPAE
6. **Resposta volta** → ALB → Internet → Usuário

## 🛡️ Camadas de Segurança

### Security Groups (Firewall Virtual)

```
┌─────────────────────────────────────┐
│ ALB Security Group                  │
│ ├─ Inbound:                         │
│ │  ├─ Port 80 (HTTP) ← 0.0.0.0/0   │
│ │  └─ Port 443 (HTTPS) ← 0.0.0.0/0 │
│ └─ Outbound: All                    │
└─────────────────────────────────────┘
          │
          ↓ (permite tráfego para)
┌─────────────────────────────────────┐
│ EC2 Security Group                  │
│ ├─ Inbound:                         │
│ │  ├─ Port 80 ← ALB SG             │
│ │  ├─ Port 443 ← ALB SG            │
│ │  └─ Port 22 ← Seu IP (SSH)       │
│ └─ Outbound: All                    │
└─────────────────────────────────────┘
```

### Network ACLs
- Todas as subnets: ALLOW ALL (stateless)
- Security Groups fazem o controle fino (stateful)

## 📊 Auto Scaling

### Políticas de Escalabilidade

```
CPU > 70% (2 períodos de 2 min)
    ↓
┌───────────────┐
│ Scale UP      │ → Adiciona 1 instância
│ Cooldown: 5min│
└───────────────┘

CPU < 20% (2 períodos de 2 min)
    ↓
┌───────────────┐
│ Scale DOWN    │ → Remove 1 instância
│ Cooldown: 5min│
└───────────────┘
```

### Configuração ASG
- **Min**: 2 instâncias (sempre 2 rodando)
- **Max**: 4 instâncias (limite superior)
- **Desired**: 2 instâncias (capacidade inicial)
- **Health Check**: ELB + EC2

## 🌐 Rede (VPC)

```
VPC: 10.0.0.0/16
├─ Public Subnets (para ALB e NAT)
│  ├─ 10.0.0.0/24 (AZ-1)
│  └─ 10.0.1.0/24 (AZ-2)
│
├─ Private Subnets (para EC2)
│  ├─ 10.0.10.0/24 (AZ-1)
│  └─ 10.0.11.0/24 (AZ-2)
│
├─ Internet Gateway (IGW)
│  └─ Conecta VPC à Internet
│
├─ NAT Gateways (2x)
│  ├─ NAT-AZ1 → Public Subnet AZ-1
│  └─ NAT-AZ2 → Public Subnet AZ-2
│
└─ Route Tables
   ├─ Public RT → 0.0.0.0/0 → IGW
   └─ Private RT → 0.0.0.0/0 → NAT
```

## 🔍 Monitoramento (CloudWatch)

### Métricas Coletadas

```
EC2 Instances
├─ CPUUtilization
├─ NetworkIn/Out
├─ DiskReadOps/WriteOps
├─ StatusCheckFailed
└─ MemoryUtilization (via CloudWatch Agent)

Load Balancer
├─ RequestCount
├─ TargetResponseTime
├─ HealthyHostCount
├─ UnHealthyHostCount
├─ HTTPCode_Target_2XX_Count
└─ HTTPCode_Target_5XX_Count
```

### Alarmes Configurados

| Alarme | Métrica | Threshold | Ação |
|--------|---------|-----------|------|
| High CPU | CPUUtilization | > 70% | Scale Up |
| Low CPU | CPUUtilization | < 20% | Scale Down |
| Unhealthy Hosts | UnHealthyHostCount | > 0 | Notificação |
| High Response Time | TargetResponseTime | > 2s | Notificação |

### Logs

```
CloudWatch Logs
├─ /aws/ec2/upae/nginx/access
│  └─ Logs de acesso (requests HTTP)
│
├─ /aws/ec2/upae/nginx/error
│  └─ Logs de erro do Nginx
│
└─ /aws/ec2/upae/system
   └─ Logs do sistema operacional
```

## 💾 Persistência de Dados

### Volumes EBS
- Cada instância EC2 tem 1 volume EBS (8GB GP3)
- Tipo: General Purpose SSD (gp3)
- Encrypted: Sim (padrão AWS)
- Backups: Snapshots automáticos (recomendado configurar)

### Estado da Aplicação
- **Frontend**: Arquivos estáticos em `/var/www/upae`
- **Backend API** (se houver): Conecta a RDS ou DynamoDB
- **Sessões**: Usar ElastiCache Redis para sessões compartilhadas
- **Uploads**: Usar S3 para armazenamento de arquivos

## 🚦 Health Checks

### ALB Health Check
```
Protocol: HTTP
Path: /
Port: 80
Interval: 30 segundos
Timeout: 5 segundos
Healthy Threshold: 2 checks consecutivos
Unhealthy Threshold: 2 checks consecutivos
```

### Auto Scaling Health Check
```
Type: ELB (usa health check do Load Balancer)
Grace Period: 300 segundos (5 min)
```

## 🔐 IAM Roles e Permissions

```
EC2 Instance Role
├─ AmazonSSMManagedInstanceCore
│  └─ Permite Session Manager (SSH sem chave)
│
├─ CloudWatchAgentServerPolicy
│  └─ Permite enviar métricas e logs
│
└─ Custom Policies (adicionar conforme necessário)
   ├─ S3 Read (se precisar ler de bucket)
   ├─ DynamoDB Access (se usar banco NoSQL)
   └─ RDS Connect (se usar banco relacional)
```

## 📈 Escalabilidade Horizontal

### Como Funciona

1. **Carga aumenta** → CPU sobe para 75%
2. **CloudWatch detecta** → Alarme dispara após 2 min
3. **Auto Scaling** → Lança nova instância
4. **Launch Template** → Usa AMI + user-data.sh
5. **Inicialização** → 3-5 min (instalar nginx, app, etc)
6. **Health Check** → ALB verifica se está saudável
7. **Em produção** → ALB começa a enviar tráfego
8. **Carga distribui** → CPU normaliza

### Como Desescala

1. **Carga diminui** → CPU cai para 15%
2. **CloudWatch detecta** → Alarme dispara após 2 min
3. **Auto Scaling** → Remove 1 instância
4. **Cooldown** → Aguarda 5 min antes de nova ação
5. **Mínimo respeitado** → Nunca menos que 2 instâncias

## 🌍 Multi-Região (Futuro)

Para alta disponibilidade global:

```
Route 53 (DNS)
├─ Latency-based routing
│
├─ us-east-1 (Norte da Virgínia)
│  └─ ALB + ASG + EC2
│
├─ sa-east-1 (São Paulo)
│  └─ ALB + ASG + EC2
│
└─ eu-west-1 (Irlanda)
   └─ ALB + ASG + EC2
```

## 💰 Breakdown de Custos Mensais

| Recurso | Quantidade | Custo/unidade | Total/mês |
|---------|-----------|---------------|-----------|
| EC2 t3.micro | 2 | $7.50 | $15.00 |
| ALB | 1 | $16.50 | $16.50 |
| NAT Gateway | 2 | $32.50 | $65.00 |
| Data Transfer | ~100GB | $0.09/GB | $9.00 |
| CloudWatch Logs | ~10GB | $0.50/GB | $5.00 |
| EBS (16GB total) | 16GB | $0.10/GB | $1.60 |
| **TOTAL** | | | **~$112/mês** |
| **Com Free Tier** | | | **~$15/mês** |

### Otimizações de Custo:
1. **Usar 1 NAT**: Economiza $32.50/mês
2. **Instâncias públicas**: Elimina NAT ($65/mês)
3. **Reserved Instances**: 30-40% desconto
4. **Spot Instances**: 70-90% desconto (não recomendado para produção)

## 📝 Notas Importantes

### Alta Disponibilidade
- ✅ Multi-AZ (2 zonas de disponibilidade)
- ✅ Health checks automáticos
- ✅ Auto Scaling ativo
- ✅ Load Balancer redundante
- ⚠️ Considere Multi-Região para DR

### Segurança
- ✅ Instâncias em subnets privadas
- ✅ Security Groups bem definidos
- ✅ IAM roles com least privilege
- ✅ EBS encriptado por padrão
- ⚠️ Adicione WAF para proteção adicional
- ⚠️ Habilite GuardDuty para detecção de ameaças

### Performance
- ✅ ALB com HTTP/2
- ✅ Auto Scaling automático
- ✅ Instâncias t3 (burstable)
- ⚠️ Configure CloudFront (CDN) para assets
- ⚠️ Use ElastiCache para cache de dados

### Backup e DR
- ⚠️ Configure AWS Backup para EBS snapshots
- ⚠️ Versionamento no S3 para arquivos
- ⚠️ RDS Multi-AZ se usar banco de dados
- ⚠️ Cross-region replication para DR

---

**Esta arquitetura fornece uma base sólida, escalável e segura para o sistema UPAE!** 🏗️
