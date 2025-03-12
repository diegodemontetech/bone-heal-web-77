
// O erro indica que está tentando acessar zip_code em um objeto de erro.
// Adicione verificação de tipo antes de acessar a propriedade:

if (userData && 'zip_code' in userData) {
  const zipCode = userData.zip_code || '';
  // use zipCode aqui
} else {
  // Use um valor padrão ou mostre mensagem de erro
  console.error("Erro ao obter endereço do usuário:", userData);
  // Talvez tenha que redirecionar ou mostrar uma mensagem
}
