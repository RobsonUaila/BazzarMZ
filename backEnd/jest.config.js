module.exports = {
  testEnvironment: 'node',
  verbose: true,
  // Limpa mocks entre os testes
  clearMocks: true,
  // Diretório para relatórios de cobertura de código
  coverageDirectory: 'coverage',
  // Onde procurar os arquivos de teste
  roots: ['<rootDir>/__tests__'],
  // Finaliza o processo após a execução dos testes para evitar que fiquem abertos
  forceExit: true,
};