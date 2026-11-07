const botao_cadastrar_Cliente = document.getElementById('cadastrarCliente');
botao_cadastrar_Cliente.addEventListener('click', abrir_Modal);

function abrir_Modal(){
  document.getElementById('modal').style.display = 'block';
}


function fechar_Modal(){
  const confirma = confirm('Deseja realmente fechar essa tela?')
  if (confirma === true){
    document.getElementById('modal').style.display = 'none';
    return;
  }
}


const botao_Cancelar = document.getElementById('cancelar');
botao_Cancelar.addEventListener('click', limpar_inputs_Modal);

function limpar_inputs_Modal(){
  document.getElementById('formulario_Modal').reset(); 
}


const botao_Salvar = document.getElementById('salvar');
botao_Salvar.addEventListener('click', salvar_Banco);

async function salvar_Banco(){
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const celular = parseInt(document.getElementById('celular').value);
  const cidade = document.getElementById('cidade').value.trim();

  if (!nome || !email || !celular || !cidade){
    alert ('Preencha todos os campos!');
    return;
  }

  try {
    const resposta = await fetch('/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, celular, cidade})
    });

    const data = await resposta.json();

    if (resposta.ok) {
      alert(data.message);
      limpar_inputs_Modal();
      
    } else {
      alert('Erro ao salvar: ' + data.message);
    }
  } catch (error) {
    alert('Erro na comunicação com o servidor.');
    console.error(error);
  }

  location.reload();

}

  

  



