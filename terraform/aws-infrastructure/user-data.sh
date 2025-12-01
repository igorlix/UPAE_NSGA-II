#!/bin/bash
# User Data Script para configurar servidor web UPAE
# Este script é executado automaticamente quando a instância EC2 inicia

set -e

# Atualizar sistema
dnf update -y

# Instalar pacotes necessários
dnf install -y \
    nginx \
    git \
    curl \
    wget \
    unzip \
    amazon-cloudwatch-agent

# Configurar timezone
timedatectl set-timezone America/Recife

# Criar diretório para a aplicação
mkdir -p /var/www/upae
cd /var/www/upae

# Clonar ou fazer download dos arquivos da aplicação
# OPÇÃO 1: Se você tiver um repositório Git
# git clone https://github.com/seu-usuario/upae-sistema.git .

# OPÇÃO 2: Criar estrutura de arquivos diretamente
# Por enquanto, vamos criar um placeholder HTML
cat > /var/www/upae/index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UPAE - Sistema de Agendamento</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; }
        .status {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(46, 213, 115, 0.3);
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 UPAE - Sistema de Agendamento</h1>
        <p>Sistema Online de Otimização de Alocação de Pacientes</p>
        <div class="status">
            ✅ Servidor configurado com sucesso!
            <br>
            <small>Instância: <span id="instance-id">Carregando...</span></small>
        </div>
        <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
            Secretaria de Saúde do Estado de Pernambuco
        </p>
    </div>
    <script>
        // Pegar ID da instância via metadata
        fetch('http://169.254.169.254/latest/meta-data/instance-id')
            .then(r => r.text())
            .then(id => document.getElementById('instance-id').textContent = id)
            .catch(() => document.getElementById('instance-id').textContent = 'N/A');
    </script>
</body>
</html>
EOF

# Configurar permissões
chown -R nginx:nginx /var/www/upae
chmod -R 755 /var/www/upae

# Configurar Nginx
cat > /etc/nginx/conf.d/upae.conf << 'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/upae;
    index index.html;

    # Logs
    access_log /var/log/nginx/upae_access.log;
    error_log /var/log/nginx/upae_error.log;

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Servir arquivos estáticos
    location / {
        try_files $uri $uri/ =404;
    }

    # Cache para assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Desabilitar configuração padrão do nginx
rm -f /etc/nginx/conf.d/default.conf

# Testar configuração do nginx
nginx -t

# Iniciar e habilitar Nginx
systemctl start nginx
systemctl enable nginx

# Configurar CloudWatch Agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/config.json << 'EOF'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/upae_access.log",
            "log_group_name": "/aws/ec2/upae/nginx/access",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/nginx/upae_error.log",
            "log_group_name": "/aws/ec2/upae/nginx/error",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "UPAE/WebServer",
    "metrics_collected": {
      "mem": {
        "measurement": [
          {
            "name": "mem_used_percent",
            "rename": "MemoryUtilization"
          }
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          {
            "name": "used_percent",
            "rename": "DiskUtilization"
          }
        ],
        "metrics_collection_interval": 60,
        "resources": ["*"]
      }
    }
  }
}
EOF

# Iniciar CloudWatch Agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json

# Criar script de atualização automática da aplicação
cat > /usr/local/bin/update-upae.sh << 'EOF'
#!/bin/bash
# Script para atualizar a aplicação UPAE
# Execute: sudo /usr/local/bin/update-upae.sh

cd /var/www/upae

# Fazer backup
tar -czf /tmp/upae-backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Atualizar do Git (descomente se usar Git)
# git pull origin main

# Reiniciar Nginx
systemctl reload nginx

echo "Aplicação atualizada com sucesso!"
EOF

chmod +x /usr/local/bin/update-upae.sh

# Configurar firewall (firewalld)
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Criar arquivo de informações do sistema
cat > /var/www/upae/server-info.txt << EOF
Server configured at: $(date)
Hostname: $(hostname)
Instance ID: $(ec2-metadata --instance-id | cut -d " " -f 2)
Project: ${project_name}
EOF

# Log de conclusão
echo "User data script completed successfully at $(date)" >> /var/log/upae-setup.log

# Sinalizar que o setup foi concluído
touch /var/www/upae/.setup-complete
