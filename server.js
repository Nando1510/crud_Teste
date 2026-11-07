const express = require('express');
const mongoose = require('mongoose');
const Funcionario = require('./models/Funcionario');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// CONECTA O SERVIDOR NODE.JS AO BANCO DE DADOS MONGODB
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://nandohanauer01_db_user:mariluz#canoas01@cluster0.fbgabq9.mongodb.net/imcDB?retryWrites=true&w=majority'; 





// FUNÇÃO QUE GERA UM ID  CRESCENTE PARA CADA NOVO REGISTRO
async function gerarCustomId() {
  const ultima = await Funcionario.findOne().sort({ customId: -1 });
  return ultima ? ultima.customId + 1 : 1;
}

// ROTA PARA SALVAR OS DADOS
app.post('/salvar', async (req, res) => {
  try {
    const { nome, email, celular, cidade } = req.body;


    // AQUI VERIFICA SE JÁ EXISTE UM USUÁRIO ADMINISTRADOR COM O MESMO NOME
    //CONSIDERAMOS QUE nome_INPUT1 SEJA O INPUT COM O NOME DE nome
    const existente = await Funcionario.findOne({nome});
    if (existente) {
      return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
    }

    
    const customId = await gerarCustomId(); // -> AQUI ELE GERA UM IP FIXO PARA CADA REGISTRO

    const funcionario = new Funcionario({ customId, nome, email, celular, cidade});
    await funcionario.save();

    console.log('Dados salvos:', funcionario);
    res.status(201).json({ message: 'Dados salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({ message: 'Erro ao salvar dados' });
  }
});

// ROTA PARA LISTAR OS REGISTROS
app.get('/listar_Registros', async (req, res) => {
  try {
    const registros = await Funcionario.find();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar registros' });
  }
});

// ROTA PARA ATUALIZAR REGISTRO
app.put('/atualizar/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, celular, cidade} = req.body;

  try {
    await Funcionario.updateOne(
      { customId: id },
      { $set: { nome, email, celular, cidade} }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Erro ao atualizar:', err);
    res.status(500).send('Erro ao atualizar registro');
  }
});

// ROTA PARA EXCLUIR REGISTRO
app.delete('/excluir/:customId', async (req, res) => {
  await Funcionario.findOneAndDelete({ customId: req.params.customId });
  res.json({ message: 'Registro excluído!' });
});




//NO FIM DO ARQUIVO


// INICIA O SERVIDOR APÓS GARANTIR A CONEXÃO COM O MONGODB
// INICIA O SERVIDOR APÓS GARANTIR A CONEXÃO COM O MONGODB
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB Atlas conectado com sucesso!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });

