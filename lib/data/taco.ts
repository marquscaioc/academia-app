// Subset da TACO (Tabela Brasileira de Composicao de Alimentos) — valores de
// REFERENCIA aproximados por 100 g (kcal, proteina, carboidrato, gordura).
// Usado para busca offline no registro alimentar; os valores sao editaveis
// pelo usuario apos selecionar (porcoes/marcas variam).

export interface TacoFood {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const TACO_FOODS: TacoFood[] = [
  // Cereais, paes e massas
  { name: "Arroz branco cozido", kcal: 128, protein: 2.5, carbs: 28.1, fat: 0.2 },
  { name: "Arroz integral cozido", kcal: 124, protein: 2.6, carbs: 25.8, fat: 1.0 },
  { name: "Macarrao cozido", kcal: 102, protein: 3.3, carbs: 20.3, fat: 0.6 },
  { name: "Pao frances", kcal: 300, protein: 8.0, carbs: 58.6, fat: 3.1 },
  { name: "Pao de forma integral", kcal: 253, protein: 9.4, carbs: 49.0, fat: 3.7 },
  { name: "Pao de queijo", kcal: 363, protein: 4.8, carbs: 38.0, fat: 21.0 },
  { name: "Aveia em flocos", kcal: 394, protein: 13.9, carbs: 66.6, fat: 8.5 },
  { name: "Tapioca", kcal: 240, protein: 0.0, carbs: 60.0, fat: 0.0 },
  { name: "Cuscuz de milho cozido", kcal: 112, protein: 2.2, carbs: 23.5, fat: 0.7 },
  { name: "Quinoa cozida", kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
  { name: "Granola", kcal: 471, protein: 10.0, carbs: 65.0, fat: 18.0 },
  // Leguminosas
  { name: "Feijao carioca cozido", kcal: 76, protein: 4.8, carbs: 13.6, fat: 0.5 },
  { name: "Feijao preto cozido", kcal: 77, protein: 4.5, carbs: 14.0, fat: 0.5 },
  { name: "Lentilha cozida", kcal: 93, protein: 6.3, carbs: 16.3, fat: 0.5 },
  { name: "Grao de bico cozido", kcal: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },
  { name: "Soja cozida", kcal: 141, protein: 12.5, carbs: 9.9, fat: 6.0 },
  // Carnes, ovos e peixes
  { name: "Peito de frango grelhado", kcal: 159, protein: 32.0, carbs: 0.0, fat: 2.5 },
  { name: "Coxa de frango cozida", kcal: 170, protein: 25.0, carbs: 0.0, fat: 7.0 },
  { name: "Patinho bovino grelhado", kcal: 219, protein: 35.9, carbs: 0.0, fat: 7.3 },
  { name: "Carne moida (acem) cozida", kcal: 212, protein: 26.7, carbs: 0.0, fat: 11.0 },
  { name: "Ovo de galinha cozido", kcal: 146, protein: 13.3, carbs: 0.6, fat: 9.5 },
  { name: "Ovo frito", kcal: 240, protein: 15.6, carbs: 1.2, fat: 19.0 },
  { name: "Clara de ovo cozida", kcal: 52, protein: 11.0, carbs: 0.7, fat: 0.2 },
  { name: "Tilapia grelhada", kcal: 128, protein: 26.2, carbs: 0.0, fat: 2.7 },
  { name: "Salmao grelhado", kcal: 244, protein: 26.0, carbs: 0.0, fat: 15.0 },
  { name: "Atum em agua (lata)", kcal: 116, protein: 26.0, carbs: 0.0, fat: 1.0 },
  { name: "Sardinha em oleo", kcal: 208, protein: 24.6, carbs: 0.0, fat: 11.5 },
  { name: "Peito de peru", kcal: 109, protein: 18.9, carbs: 2.0, fat: 3.0 },
  { name: "Presunto", kcal: 113, protein: 18.0, carbs: 1.5, fat: 4.0 },
  { name: "Linguica toscana", kcal: 296, protein: 16.0, carbs: 1.0, fat: 26.0 },
  { name: "Bacon", kcal: 541, protein: 37.0, carbs: 0.0, fat: 42.0 },
  // Laticinios
  { name: "Leite integral", kcal: 61, protein: 3.2, carbs: 4.7, fat: 3.3 },
  { name: "Leite desnatado", kcal: 35, protein: 3.4, carbs: 5.0, fat: 0.2 },
  { name: "Iogurte natural integral", kcal: 51, protein: 4.1, carbs: 1.9, fat: 3.0 },
  { name: "Iogurte grego", kcal: 97, protein: 9.0, carbs: 4.0, fat: 5.0 },
  { name: "Queijo minas frescal", kcal: 264, protein: 17.4, carbs: 3.0, fat: 20.2 },
  { name: "Queijo mussarela", kcal: 280, protein: 22.0, carbs: 3.0, fat: 20.0 },
  { name: "Requeijao cremoso", kcal: 257, protein: 10.0, carbs: 4.0, fat: 23.0 },
  { name: "Manteiga", kcal: 717, protein: 0.9, carbs: 0.1, fat: 81.0 },
  // Frutas
  { name: "Banana prata", kcal: 98, protein: 1.3, carbs: 26.0, fat: 0.1 },
  { name: "Banana nanica", kcal: 92, protein: 1.4, carbs: 23.8, fat: 0.1 },
  { name: "Maca", kcal: 56, protein: 0.3, carbs: 15.2, fat: 0.4 },
  { name: "Laranja", kcal: 46, protein: 1.0, carbs: 11.5, fat: 0.1 },
  { name: "Mamao", kcal: 40, protein: 0.5, carbs: 10.4, fat: 0.1 },
  { name: "Manga", kcal: 64, protein: 0.4, carbs: 16.7, fat: 0.2 },
  { name: "Melancia", kcal: 33, protein: 0.9, carbs: 8.1, fat: 0.0 },
  { name: "Abacate", kcal: 96, protein: 1.2, carbs: 6.0, fat: 8.4 },
  { name: "Morango", kcal: 30, protein: 0.9, carbs: 6.8, fat: 0.3 },
  { name: "Uva", kcal: 53, protein: 0.7, carbs: 13.6, fat: 0.2 },
  // Tuberculos e legumes
  { name: "Batata inglesa cozida", kcal: 52, protein: 1.2, carbs: 11.9, fat: 0.0 },
  { name: "Batata doce cozida", kcal: 77, protein: 0.6, carbs: 18.4, fat: 0.1 },
  { name: "Mandioca cozida", kcal: 125, protein: 0.6, carbs: 30.1, fat: 0.3 },
  { name: "Tomate", kcal: 15, protein: 1.1, carbs: 3.1, fat: 0.2 },
  { name: "Alface", kcal: 11, protein: 1.3, carbs: 1.7, fat: 0.2 },
  { name: "Cenoura crua", kcal: 34, protein: 1.3, carbs: 7.7, fat: 0.2 },
  { name: "Brocolis cozido", kcal: 25, protein: 2.1, carbs: 4.4, fat: 0.5 },
  // Oleaginosas, gorduras e suplementos
  { name: "Pasta de amendoim", kcal: 589, protein: 25.0, carbs: 20.0, fat: 50.0 },
  { name: "Amendoim", kcal: 544, protein: 27.0, carbs: 20.0, fat: 44.0 },
  { name: "Castanha do para", kcal: 643, protein: 14.5, carbs: 15.1, fat: 63.5 },
  { name: "Azeite de oliva", kcal: 884, protein: 0.0, carbs: 0.0, fat: 100.0 },
  { name: "Whey protein (po)", kcal: 370, protein: 80.0, carbs: 8.0, fat: 5.0 },
];
