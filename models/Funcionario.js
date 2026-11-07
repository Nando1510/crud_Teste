const mongoose = require('mongoose');

const funcionarioSchema = new mongoose.Schema({
  customId: {
    type: Number,
    unique: true,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  celular: {
    type: Number,
    required: true
  },
  cidade: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Isso adiciona createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Funcionario', funcionarioSchema);