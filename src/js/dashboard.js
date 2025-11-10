// Dashboard Administrativo - Script
document.addEventListener('DOMContentLoaded', () => {
  inicializarDashboard();
  carregarDadosMockados();
});

function inicializarDashboard() {
  // Inicializar gráficos
  criarGraficoMunicipio();
  criarGraficoComparecimento();

  // Carregar tabela
  carregarTabelaAgendamentos();
}

function criarGraficoMunicipio() {
  const ctx = document.getElementById('chartMunicipio').getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Recife', 'Cabo', 'Jaboatão', 'Olinda', 'Paulista', 'Igarassu', 'Outros'],
      datasets: [{
        label: 'Pacientes',
        data: [320, 180, 150, 120, 95, 80, 289],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: false
        }
      }
    }
  });
}

function criarGraficoComparecimento() {
  const ctx = document.getElementById('chartComparecimento').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Com Otimização',
          data: [68, 72, 78, 82, 85, 87],
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Sem Otimização (estimado)',
          data: [65, 64, 66, 63, 65, 64],
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

function carregarTabelaAgendamentos() {
  const tbody = document.getElementById('tabelaAgendamentos');

  // Dados mockados
  const agendamentos = [
    {
      paciente: 'Maria Silva',
      especialidade: 'Cardiologia',
      municipio: 'Cabo',
      distancia: '12.5 km',
      custo: 'R$ 4,10',
      status: 'Confirmado',
      statusCor: 'green'
    },
    {
      paciente: 'João Santos',
      especialidade: 'Ortopedia',
      municipio: 'Recife',
      distancia: '8.2 km',
      custo: 'R$ 8,20',
      status: 'Pendente',
      statusCor: 'yellow'
    },
    {
      paciente: 'Ana Costa',
      especialidade: 'Pediatria',
      municipio: 'Olinda',
      distancia: '15.3 km',
      custo: 'R$ 4,10',
      status: 'Confirmado',
      statusCor: 'green'
    },
    {
      paciente: 'Pedro Oliveira',
      especialidade: 'Dermatologia',
      municipio: 'Jaboatão',
      distancia: '6.8 km',
      custo: 'R$ 4,10',
      status: 'Realizado',
      statusCor: 'blue'
    },
    {
      paciente: 'Carla Mendes',
      especialidade: 'Ginecologia',
      municipio: 'Paulista',
      distancia: '22.1 km',
      custo: 'R$ 8,20',
      status: 'Confirmado',
      statusCor: 'green'
    }
  ];

  const html = agendamentos.map(ag => {
    const corBadge = ag.statusCor === 'green' ? 'bg-green-100 text-green-800' :
                     ag.statusCor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                     ag.statusCor === 'blue' ? 'bg-blue-100 text-blue-800' :
                     'bg-gray-100 text-gray-800';

    return `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${ag.paciente}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${ag.especialidade}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${ag.municipio}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${ag.distancia}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${ag.custo}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${corBadge}">
            ${ag.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
          <button class="text-gray-600 hover:text-gray-900">Editar</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = html;
}

function carregarDadosMockados() {
  // Simular carregamento de dados
  console.log('Dashboard inicializado com dados mockados');
}
